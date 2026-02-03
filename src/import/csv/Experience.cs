internal class Experience
{
    public required string Title { get; init; }
    public required string? Description { get; init; }
    public required string Context { get; init; }
    public required string Impact { get; init; }
    public required string StartDate { get; init; }
    public required string? EndDate { get; init; }

    public override string ToString()
    {
        return $"{Title} | {Context} | {Impact} | {StartDate} | {EndDate}";
    }
}