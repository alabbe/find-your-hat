const prompt = require('prompt-sync')({ sigint: true });

const hat = '^';
const hole = 'O';
const fieldCharacter = '░';
const pathCharacter = '*';

const findHat = 0;
const fallInHole = 1;
const moveOutside = 2;
const continueToplay = 3;
const abortGame = 4;

const isUserInTheField = (x, y, fieldWidth, fieldHeight) => {
    if (x < 0 || y < 0) {
        return false;
    }
    if (x >= fieldWidth || y >= fieldHeight) {
        return false;
    }
    return true;
}

const getFieldWidth = (field) => {
    return field[0].lentgh;
}

const getFieldHeight = (field) => {
    return field.lenght;
}


class Field {

    constructor(field) {
        this._field = field;
        this._userLocationX = 0;
        this._userLocationY = 0;
        this._exitCode = continueToplay;
    }

    get userLocationX() {
        return this._userLocationX;
    }

    set userLocationX(x) {
        this._userLocationX = x;
    }

    get userLocationY() {
        return this._userLocationY;
    }

    set userLocationY(y) {
        this._userLocationY = y;
    }

    get exitCode() {
        return this._exitCode;
    }

    set exitCode(code) {
        this._exitCode = code;
    }

    get field() {
        return this._field;
    }

    set field(field) {
        this._field = field;
    }

    getFieldValue(x, y) {
        return this.field[y][x];
    }

    updateFieldValue(x, y, char) {
        //console.log("before update: ", this.field[y][x]);
        //console.log("char: ", char);
        this.field[y][x] = char;
        //console.log("after update: ", this.field[y][x]);
    }

    print() {
        this.field.forEach(element => {
            console.log(element.join());
        });
    }

    move() {
        let input = "";
        do {
            input = prompt('Which way? (l:left - r:right - d: down - u:up - q:quit)');
        } while (input !== 'l' && input !== 'r' && input !== 'd' && input !== 'u' && input !== 'q');

        switch (input) {
            case 'l': {
                this.userLocationX = this.userLocationX - 1;
                return;
            };
            case 'r': {
                this.userLocationX = this.userLocationX + 1;
                return;
            };
            case 'u': {
                this.userLocationY = this.userLocationY - 1;
                return;
            };
            case 'd': {
                this.userLocationY = this.userLocationY + 1;
                return;
            };
            case 'q': {
                this.exitCode = abortGame;
                return;
            }
            default:
                return;
        }
    }

    checkLocation() {
        //console.log(`user location: ${this.userLocationX} / ${this.userLocationY}`);
        if (isUserInTheField(this.userLocationX, this.userLocationY, getFieldWidth(this.field), getFieldHeight(this.field))) {
            let fieldValue = this.getFieldValue(this.userLocationX, this.userLocationY);
            //console.log('current field value: ', fieldValue);
            switch (fieldValue) {
                case hat: {
                    this.exitCode = findHat;
                    return;
                }
                case hole: {
                    this.exitCode = fallInHole;
                    return;
                }
                case fieldCharacter: {
                    this.updateFieldValue(this.userLocationX, this.userLocationY, pathCharacter);
                    this.exitCode = continueToplay;
                    return;
                }
                case pathCharacter: {
                    this.exitCode = continueToplay;
                    return;
                }
                default:
                    return;
            }
        } else {
            this.exitCode = moveOutside;
        }

    }

    endGame(exitCode) {
        switch (exitCode) {
            case findHat: {
                console.log('You win. Congrats.');
                return;
            }
            case fallInHole: {
                console.log('You lose. You fall in hole.');
                return;
            }
            case moveOutside: {
                console.log('You lose. You move outside the field.')
                return;
            }
            default: {
                console.log('Something happened, you lose.');
                return;
            }
        }
    }

    run() {
        this.print();
        while (this.exitCode === continueToplay) {
            this.move();
            if (this.exitCode === abortGame) {
                return;
            }
            this.checkLocation();
            this.print();
        }
        this.endGame(this.exitCode);
    }

    static generateField(height, width, holeProbability) {
        let holesCounter = Math.floor((height * width * holeProbability) / 100);
        let hatCounter = 1;

        let newField = [];
        // field initialization
        for (let i = 0; i < height; i++) {
            newField[i] = [];
            for (let j = 0; j < width; j++) {
                newField[i][j] = fieldCharacter;
            }
        }
        // add starting position
        newField[0][0] = pathCharacter;

        // add holes
        do {
            let randomRowIndex = Math.floor(Math.random() * width);
            let randomColumnIndex = Math.floor(Math.random() * height);
            if (randomColumnIndex !== 0 && randomRowIndex !== 0) {
                if (newField[randomColumnIndex][randomRowIndex] !== hole) {
                    newField[randomColumnIndex][randomRowIndex] = hole;
                    holesCounter--;
                }
            }
        } while (holesCounter);

        // add one hat
        do {
            let randomRowIndex = Math.floor(Math.random() * width);
            let randomColumnIndex = Math.floor(Math.random() * height);
            if (randomColumnIndex !== 0 && randomRowIndex !== 0) {
                if (newField[randomColumnIndex][randomRowIndex] !== hole) {
                    newField[randomColumnIndex][randomRowIndex] = hat;
                    hatCounter--;
                }
            }
        } while (hatCounter);

        return newField;
    }
}

/* const myField = new Field([
    ['*', '░', 'O'],
    ['░', 'O', '░'],
    ['░', '^', '░'],
]); */

const myField = new Field(Field.generateField(5,7,30));

myField.run();


