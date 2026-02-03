internal class Experience
{
    internal required string Title { get; init; }
    internal required string? Description { get; init; }
    internal required string Context { get; init; }
    internal required string Impact { get; init; }
    internal required string StartDate { get; init; }
    internal required string? EndDate { get; init; }

    public override string ToString()
    {
        return $"{Title} | {Context} | {Impact} | {StartDate} | {EndDate}";
    }
}