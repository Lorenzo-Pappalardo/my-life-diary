using System.Text.Json;
using System.Text.RegularExpressions;

internal partial class Parser
{
    [GeneratedRegex("^\"?(?<content>.+),(?<context>[^\"]+),(?<impact>[^\"]+),(?<dates>[^\"]+)$", RegexOptions.IgnoreCase)]
    private static partial Regex ComplexInput();

    private const int MaxTitleLength = 100;
    private const string outputDirectory = "../../generated/import";

    private readonly JsonSerializerOptions jsonSerializerOptions = new()
    {
        IncludeFields = true,
        WriteIndented = true,
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };

    private readonly string path;

    internal Parser(string path)
    {
        this.path = path;

        if (!Directory.Exists(outputDirectory))
            Directory.CreateDirectory(outputDirectory);
    }

    internal async Task<List<string>> Parse()
    {
        DateOnly today = DateOnly.FromDateTime(DateTime.Now);
        using FileStream outputFile = File.Create(Path.Combine(outputDirectory, $"from_csv-{today.Year}_{today.Month}_{today.Day}.json"));

        List<string> errors = [];
        List<Experience> experiences = [];

        foreach (string line in await File.ReadAllLinesAsync(path))
        {
            try
            {
                var matches = ComplexInput().Match(line);

                if (matches.Success)
                {
                    var content = matches.Groups["content"].Value;

                    if (content.ElementAt(content.Length - 1) == '"')
                        content = content[..^1];
                    content = content.Replace("\"\"", "\"");

                    var dates = matches.Groups["dates"].Value.Split(" - ");

                    experiences.Add(
                        new Experience()
                        {
                            Title = content[..Math.Min(MaxTitleLength, content.Length)],
                            Description = content,
                            Context = matches.Groups["context"].Value,
                            Impact = matches.Groups["impact"].Value,
                            StartDate = ParseUTC(dates[0]),
                            EndDate = dates.Length > 1 ? ParseUTC(dates[1]) : null
                        }
                    );
                }
                else
                    throw new Exception();
            }
            catch
            {
                errors.Add(line);
            }
        }

        await JsonSerializer.SerializeAsync(outputFile, experiences, jsonSerializerOptions);

        return errors;
    }

    private static DateTime ParseUTC(string possibleDate)
    {
        // From DD/MM/YYYY to YYYY-MM-DDT00:00:00Z
        return DateTime.Parse($"{string.Join("-", possibleDate.Split('/').Reverse())}T00:00:00Z").ToUniversalTime();
    }
}
