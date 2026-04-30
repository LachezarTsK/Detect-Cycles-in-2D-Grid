
function containsCycle(matrix: string[][]): boolean {
    const util = new Util(matrix.length, matrix[0].length);

    for (let row = 0; row < util.totalRows; ++row) {
        for (let column = 0; column < util.totalColumns; ++column) {
            if (cycleFoundInStepForward(matrix, row, column, util)) {
                return true;
            }
            if (cycleFoundInStepDownward(matrix, row, column, util)) {
                return true;
            }
        }
    }
    return false;
};

function cycleFoundInStepForward(matrix: string[][], row: number, column: number, util: Util): boolean {
    if (column + 1 === util.totalColumns || matrix[row][column] !== matrix[row][column + 1]) {
        return false;
    }
    const currentIndex = getIndexFlattenedMatrix(row, column, util);
    const stepForwardIndex = getIndexFlattenedMatrix(row, column + 1, util);
    return !util.unionFind.joinByRank(currentIndex, stepForwardIndex);
}

function cycleFoundInStepDownward(matrix: string[][], row, column, util): boolean {
    if (row + 1 === util.totalRows || matrix[row][column] !== matrix[row + 1][column]) {
        return false;
    }
    const currentIndex = getIndexFlattenedMatrix(row, column, util);
    const stepDownwardIndex = getIndexFlattenedMatrix(row + 1, column, util);
    return !util.unionFind.joinByRank(currentIndex, stepDownwardIndex);
}

function getIndexFlattenedMatrix(row: number, column: number, util: Util): number {
    return row * util.totalColumns + column;
}

class Util {

    unionFind: UnionFind;

    constructor(public totalRows: number, public totalColumns: number) {
        this.unionFind = new UnionFind(totalRows * totalColumns);
    }
}

class UnionFind {

    private rank: number[];
    private parent: number[];


    constructor(numberOfElements: number) {
        this.rank = new Array(numberOfElements);
        this.parent = new Array(numberOfElements);
        for (let i = 0; i < numberOfElements; ++i) {
            this.rank[i] = 1;
            this.parent[i] = i;
        }
    }

    private findParent(index: number): number {
        if (this.parent[index] !== index) {
            this.parent[index] = this.findParent(this.parent[index]);
        }
        return this.parent[index];
    }

    joinByRank(indexOne: number, indexTwo: number): boolean {
        const first = this.findParent(indexOne);
        const second = this.findParent(indexTwo);
        if (first === second) {
            return false;
        }

        if (this.rank[first] >= this.rank[second]) {
            this.rank[first] += this.rank[second];
            this.parent[second] = first;
        } else {
            this.rank[second] += this.rank[first];
            this.parent[first] = second;
        }
        return true;
    }
}
