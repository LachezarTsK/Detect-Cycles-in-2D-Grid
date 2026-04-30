
#include <span>
#include <memory>
#include <vector>
using namespace std;

class Solution {

    class UnionFind {

        vector<int> rank;
        vector<int> parent;

        UnionFind(int numberOfElements) {
            rank.resize(numberOfElements);
            parent.resize(numberOfElements);
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

    public:    
        bool joinByRank(int indexOne, int indexTwo) {
            int first = findParent(indexOne);
            int second = findParent(indexTwo);
            if (first == second) {
                return false;
            }

            if (rank[first] >= rank[second]) {
                rank[first] += rank[second];
                parent[second] = first;
            }
            else {
                rank[second] += rank[first];
                parent[first] = second;
            }
            return true;
        }
    };

    int totalRows{};
    int totalColumns{};
    unique_ptr<UnionFind> unionFind;

public:
    bool containsCycle(const vector<vector<char>>& matrix) {
        totalRows = matrix.size();
        totalColumns = matrix[0].size();
        unionFind = make_unique<UnionFind>(totalRows * totalColumns);

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

    bool cycleFoundInStepForward(span<const vector<char>> matrix, int row, int column) {
        if (column + 1 == totalColumns || matrix[row][column] != matrix[row][column + 1]) {
            return false;
        }
        int currentIndex = getIndexFlattenedMatrix(row, column);
        int stepForwardIndex = getIndexFlattenedMatrix(row, column + 1);
        return !unionFind->joinByRank(currentIndex, stepForwardIndex);
    }

    bool cycleFoundInStepDownward(span<const vector<char>> matrix, int row, int column) {
        if (row + 1 == totalRows || matrix[row][column] != matrix[row + 1][column]) {
            return false;
        }
        int currentIndex = getIndexFlattenedMatrix(row, column);
        int stepDownwardIndex = getIndexFlattenedMatrix(row + 1, column);
        return !unionFind->joinByRank(currentIndex, stepDownwardIndex);

    }

    int getIndexFlattenedMatrix(int row, int column) {
        return row * totalColumns + column;
    }
};
