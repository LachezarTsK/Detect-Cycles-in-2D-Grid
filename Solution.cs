
public class Solution
{
    private int totalRows;
    private int totalColumns;
    private UnionFind? unionFind;

    public bool ContainsCycle(char[][] matrix)
    {
        totalRows = matrix.Length;
        totalColumns = matrix[0].Length;
        unionFind = new UnionFind(totalRows * totalColumns);

        for (int row = 0; row < totalRows; ++row)
        {
            for (int column = 0; column < totalColumns; ++column)
            {
                if (CycleFoundInStepForward(matrix, row, column))
                {
                    return true;
                }
                if (CycleFoundInStepDownward(matrix, row, column))
                {
                    return true;
                }
            }
        }
        return false;
    }

    private bool CycleFoundInStepForward(char[][] matrix, int row, int column)
    {
        if (column + 1 == totalColumns || matrix[row][column] != matrix[row][column + 1])
        {
            return false;
        }
        int currentIndex = GetIndexFlattenedMatrix(row, column);
        int stepForwardIndex = GetIndexFlattenedMatrix(row, column + 1);
        return !unionFind!.JoinByRank(currentIndex, stepForwardIndex);
    }

    private bool CycleFoundInStepDownward(char[][] matrix, int row, int column)
    {
        if (row + 1 == totalRows || matrix[row][column] != matrix[row + 1][column])
        {
            return false;
        }
        int currentIndex = GetIndexFlattenedMatrix(row, column);
        int stepDownwardIndex = GetIndexFlattenedMatrix(row + 1, column);
        return !unionFind!.JoinByRank(currentIndex, stepDownwardIndex);

    }

    private int GetIndexFlattenedMatrix(int row, int column)
    {
        return row * totalColumns + column;
    }
}

class UnionFind
{
    private readonly int[] Rank;
    private readonly int[] Parent;

    public UnionFind(int numberOfElements)
    {
        Rank = new int[numberOfElements];
        Parent = new int[numberOfElements];
        for (int i = 0; i < numberOfElements; ++i)
        {
            Rank[i] = 1;
            Parent[i] = i;
        }
    }

    int FindParent(int index)
    {
        if (Parent[index] != index)
        {
            Parent[index] = FindParent(Parent[index]);
        }
        return Parent[index];
    }

    public bool JoinByRank(int indexOne, int indexTwo)
    {
        int first = FindParent(indexOne);
        int second = FindParent(indexTwo);
        if (first == second)
        {
            return false;
        }

        if (Rank[first] >= Rank[second])
        {
            Rank[first] += Rank[second];
            Parent[second] = first;
        }
        else
        {
            Rank[second] += Rank[first];
            Parent[first] = second;
        }
        return true;
    }
}
