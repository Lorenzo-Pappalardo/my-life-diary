using System.Text.RegularExpressions;

internal partial class Parser
{
    private const int MaxTitleLength = 100;

    [GeneratedRegex("^\"?(?<content>.*)\"?(?:,(?<context>[^\",]+),(?<impact>[^\",]+),(?<dates>[^\",]+))$", RegexOptions.IgnoreCase)]
    private static partial Regex ComplexInput();

    private readonly string path;

    internal Parser(string path)
    {
        this.path = path;
    }

    internal async Task<List<string>> Parse()
    {
        List<string> errors = [];

        foreach (string line in await File.ReadAllLinesAsync(path))
        {
            var matches = ComplexInput().Match(line);

            if (matches.Success)
            {
                var content = matches.Groups["content"].Value;
                var dates = matches.Groups["dates"].Value.Split(" - ");

                var e = new Experience()
                {
                    Title = content[..Math.Min(MaxTitleLength, content.Length)],
                    Description = content,
                    Context = matches.Groups["context"].Value,
                    Impact = matches.Groups["impact"].Value,
                    StartDate = dates[0],
                    EndDate = dates.Length > 1 ? dates[1] : null
                };

                Console.WriteLine(e);
            }
            else
                errors.Add(line);
        }

        return errors;
    }
}
