
public class Solution {

    private int totalRows;
    private int totalColumns;
    private UnionFind unionFind;

    public boolean containsCycle(char[][] matrix) {
        totalRows = matrix.length;
        totalColumns = matrix[0].length;
        unionFind = new UnionFind(totalRows * totalColumns);

        for (int row = 0; row < totalRows; ++row) {
            for (int column = 0; column < totalColumns; ++column) {
                if (cycleFoundInStepForward(matrix, row, column)) {
                    return true;
                }
                if (cycleFoundInStepDownward(matrix, row, column)) {
                    return true;
                }
            }
        }
        return false;
    }

    private boolean cycleFoundInStepForward(char[][] matrix, int row, int column) {
        if (column + 1 == totalColumns || matrix[row][column] != matrix[row][column + 1]) {
            return false;
        }
        int currentIndex = getIndexFlattenedMatrix(row, column);
        int stepForwardIndex = getIndexFlattenedMatrix(row, column + 1);
        return !unionFind.joinByRank(currentIndex, stepForwardIndex);
    }

    private boolean cycleFoundInStepDownward(char[][] matrix, int row, int column) {
        if (row + 1 == totalRows || matrix[row][column] != matrix[row + 1][column]) {
            return false;
        }
        int currentIndex = getIndexFlattenedMatrix(row, column);
        int stepDownwardIndex = getIndexFlattenedMatrix(row + 1, column);
        return !unionFind.joinByRank(currentIndex, stepDownwardIndex);

    }

    private int getIndexFlattenedMatrix(int row, int column) {
        return row * totalColumns + column;
    }
}

class UnionFind {

    private final int[] rank;
    private final int[] parent;

    UnionFind(int numberOfElements) {
        rank = new int[numberOfElements];
        parent = new int[numberOfElements];
        for (int i = 0; i < numberOfElements; ++i) {
            rank[i] = 1;
            parent[i] = i;
        }
    }

    int findParent(int index) {
        if (parent[index] != index) {
            parent[index] = findParent(parent[index]);
        }
        return parent[index];
    }

    boolean joinByRank(int indexOne, int indexTwo) {
        int first = findParent(indexOne);
        int second = findParent(indexTwo);
        if (first == second) {
            return false;
        }

        if (rank[first] >= rank[second]) {
            rank[first] += rank[second];
            parent[second] = first;
        } else {
            rank[second] += rank[first];
            parent[first] = second;
        }
        return true;
    }
}
