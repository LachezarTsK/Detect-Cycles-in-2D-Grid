
package main

var totalRows int
var totalColumns int
var unionFind *UnionFind

func containsCycle(matrix [][]byte) bool {
    totalRows = len(matrix)
    totalColumns = len(matrix[0])
    unionFind = NewUnionFind(totalRows * totalColumns)

    for row := range totalRows {
        for column := range totalColumns {
            if cycleFoundInStepForward(matrix, row, column) {
                return true
            }
            if cycleFoundInStepDownward(matrix, row, column) {
                return true
            }
        }
    }
    return false
}

func cycleFoundInStepForward(matrix [][]byte, row int, column int) bool {
    if column + 1 == totalColumns || matrix[row][column] != matrix[row][column + 1] {
        return false
    }
    currentIndex := getIndexFlattenedMatrix(row, column)
    stepForwardIndex := getIndexFlattenedMatrix(row, column + 1)
    return !unionFind.joinByRank(currentIndex, stepForwardIndex)
}

func cycleFoundInStepDownward(matrix [][]byte, row int, column int) bool {
    if row + 1 == totalRows || matrix[row][column] != matrix[row + 1][column] {
        return false
    }
    currentIndex := getIndexFlattenedMatrix(row, column)
    stepDownwardIndex := getIndexFlattenedMatrix(row + 1, column)
    return !unionFind.joinByRank(currentIndex, stepDownwardIndex)
}

func getIndexFlattenedMatrix(row int, column int) int {
    return row * totalColumns + column
}

type UnionFind struct {
    rank   []int
    parent []int
}

func NewUnionFind(numberOfElements int) *UnionFind {
    unionFind := &UnionFind{
        rank:   make([]int, numberOfElements),
        parent: make([]int, numberOfElements),
    }

    for i := range numberOfElements {
        unionFind.rank[i] = 1
        unionFind.parent[i] = i
    }
    return unionFind
}

func (this *UnionFind) findParent(index int) int {
    if this.parent[index] != index {
        this.parent[index] = this.findParent(this.parent[index])
    }
    return this.parent[index]
}

func (this *UnionFind) joinByRank(indexOne int, indexTwo int) bool {
    first := this.findParent(indexOne)
    second := this.findParent(indexTwo)
    if first == second {
        return false
    }

    if this.rank[first] >= this.rank[second] {
        this.rank[first] += this.rank[second]
        this.parent[second] = first
    } else {
        this.rank[second] += this.rank[first]
        this.parent[first] = second
    }
    return true
}
