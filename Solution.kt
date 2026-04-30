
class Solution {

    private var totalRows: Int = 0
    private var totalColumns: Int = 0
    private lateinit var unionFind: UnionFind

    fun containsCycle(matrix: Array<CharArray>): Boolean {
        totalRows = matrix.size
        totalColumns = matrix[0].size
        unionFind = UnionFind(totalRows * totalColumns)

        for (row in 0..<totalRows) {
            for (column in 0..<totalColumns) {
                if (cycleFoundInStepForward(matrix, row, column)) {
                    return true
                }
                if (cycleFoundInStepDownward(matrix, row, column)) {
                    return true
                }
            }
        }
        return false
    }

    private fun cycleFoundInStepForward(matrix: Array<CharArray>, row: Int, column: Int): Boolean {
        if (column + 1 == totalColumns || matrix[row][column] != matrix[row][column + 1]) {
            return false
        }
        val currentIndex = getIndexFlattenedMatrix(row, column)
        val stepForwardIndex = getIndexFlattenedMatrix(row, column + 1)
        return !unionFind.joinByRank(currentIndex, stepForwardIndex)
    }

    private fun cycleFoundInStepDownward(matrix: Array<CharArray>, row: Int, column: Int): Boolean {
        if (row + 1 == totalRows || matrix[row][column] != matrix[row + 1][column]) {
            return false
        }
        val currentIndex = getIndexFlattenedMatrix(row, column)
        val stepDownwardIndex = getIndexFlattenedMatrix(row + 1, column)
        return !unionFind.joinByRank(currentIndex, stepDownwardIndex)

    }

    private fun getIndexFlattenedMatrix(row: Int, column: Int): Int {
        return row * totalColumns + column
    }
}

class UnionFind(private val numberOfElements: Int) {

    private val rank = IntArray(numberOfElements)
    private val parent = IntArray(numberOfElements)

    init {
        for (i in 0..<numberOfElements) {
            rank[i] = 1
            parent[i] = i
        }
    }


    private fun findParent(index: Int): Int {
        if (parent[index] != index) {
            parent[index] = findParent(parent[index])
        }
        return parent[index]
    }

    fun joinByRank(indexOne: Int, indexTwo: Int): Boolean {
        val first = findParent(indexOne)
        val second = findParent(indexTwo)
        if (first == second) {
            return false
        }

        if (rank[first] >= rank[second]) {
            rank[first] += rank[second]
            parent[second] = first
        } else {
            rank[second] += rank[first]
            parent[first] = second
        }
        return true
    }
}
