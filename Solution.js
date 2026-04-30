
/**
 * @param {string[][]} matrix
 * @return {boolean}
 */
var containsCycle = function (matrix) {
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

/**
 * @param {string[][]} matrix
 * @param {number} row 
 * @param {number} column
 * @param {Util} util  
 * @return {boolean}
 */
function cycleFoundInStepForward(matrix, row, column, util) {
    if (column + 1 === util.totalColumns || matrix[row][column] !== matrix[row][column + 1]) {
        return false;
    }
    const currentIndex = getIndexFlattenedMatrix(row, column, util);
    const stepForwardIndex = getIndexFlattenedMatrix(row, column + 1, util);
    return !util.unionFind.joinByRank(currentIndex, stepForwardIndex);
}

/**
 * @param {string[][]} matrix
 * @param {number} row 
 * @param {number} column
 * @param {Util} util  
 * @return {boolean}
 */
function cycleFoundInStepDownward(matrix, row, column, util) {
    if (row + 1 === util.totalRows || matrix[row][column] !== matrix[row + 1][column]) {
        return false;
    }
    const currentIndex = getIndexFlattenedMatrix(row, column, util);
    const stepDownwardIndex = getIndexFlattenedMatrix(row + 1, column, util);
    return !util.unionFind.joinByRank(currentIndex, stepDownwardIndex);
}

/**
 * @param {number} row 
 * @param {number} column
 * @param {Util} util  
 * @return {number}
 */
function getIndexFlattenedMatrix(row, column, util) {
    return row * util.totalColumns + column;
}

class Util {

    /**
     * @param {number} totalRows 
     * @param {number} totalColumns
     */
    constructor(totalRows, totalColumns) {
        this.totalRows = totalRows;
        this.totalColumns = totalColumns;
        this.unionFind = new UnionFind(totalRows * totalColumns);
    }
}

class UnionFind {

    #rank;
    #parent;

    /**
     * @param {number} numberOfElements 
     */
    constructor(numberOfElements) {
        this.#rank = new Array(numberOfElements);
        this.#parent = new Array(numberOfElements);
        for (let i = 0; i < numberOfElements; ++i) {
            this.#rank[i] = 1;
            this.#parent[i] = i;
        }
    }

    /**
     * @param {number} index 
     * @return {number}
     */
    #findParent(index) {
        if (this.#parent[index] !== index) {
            this.#parent[index] = this.#findParent(this.#parent[index]);
        }
        return this.#parent[index];
    }

    /**
     * @param {number} indexOne 
     * @param {number} indexTwo
     * @return {boolean}
     */
    joinByRank(indexOne, indexTwo) {
        const first = this.#findParent(indexOne);
        const second = this.#findParent(indexTwo);
        if (first === second) {
            return false;
        }

        if (this.#rank[first] >= this.#rank[second]) {
            this.#rank[first] += this.#rank[second];
            this.#parent[second] = first;
        } else {
            this.#rank[second] += this.#rank[first];
            this.#parent[first] = second;
        }
        return true;
    }
}
