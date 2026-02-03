try
{
    Console.WriteLine("Path to files to import:");
    string? path = args[0] ?? Console.ReadLine();

    if (!File.Exists(path))
    {
        Console.WriteLine("Invalid path.");
        return 1;
    }

    Parser p = new(path);
    List<string> errors = await p.Parse();

    foreach (string error in errors)
    {
        Console.ForegroundColor = ConsoleColor.Red;
        Console.Error.WriteLine(error);
    }

    return errors.Count > 0 ? 1 : 0;
}
catch (Exception ex)
{
    Console.WriteLine(ex);
    return 1;
}