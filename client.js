const chessCanvas = document.getElementById('chessCanvas')
const ctx = chessCanvas.getContext('2d')

let PawnW = new Image(); PawnW.src = 'images/1.gif'
let QueenW = new Image(); QueenW.src = 'images/5.gif'
let HorseW = new Image(); HorseW.src = 'images/2.gif'
let BishopW = new Image(); BishopW.src = 'images/3.gif'
let RookW = new Image(); RookW.src = 'images/4.gif'
let KingW = new Image(); KingW.src = 'images/6.gif'
let PawnB = new Image(); PawnB.src = 'images/7.gif'
let QueenB = new Image(); QueenB.src = 'images/11.gif'
let HorseB = new Image(); HorseB.src = 'images/8.gif'
let BishopB = new Image(); BishopB.src = 'images/9.gif'
let RookB = new Image(); RookB.src = 'images/10.gif'
let KingB = new Image(); KingB.src = 'images/12.gif'

let FigureImage = {
    white:{
        0:PawnW,
        1:HorseW,
        2:BishopW,
        3:RookW,
        4:QueenW,
        5:KingW
    },
    black:{
        0:PawnB,
        1:HorseB,
        2:BishopB,
        3:RookB,
        4:QueenB,
        5:KingB
    }
}

const white = 0
const black = 1
const empty = -1
const pawn = 0
const horse = 1
const bishop = 2
const rook = 3
const queen = 4
const king = 5

const boardHeight = 8
const boardWidth = 8
const tileSize = chessCanvas.height / boardHeight

const whiteTileColor = '#F0D9B5'
const blackTileColor = '#B58863'
const highLightColor = '#82976A'
const invalid = 0
const valid = 1
const validCapture = 2
const castling = 3

let drawShahKing ={ 
    x:-1, 
    y:-1 
}
let curX
let curY
let currentTeam
let partnerTeam
let board
let cloneBoard

onLoad =()=>{
    startGame()
    chessCanvas.onclick = onClick
}
document.addEventListener('DOMContentLoaded', onLoad)

startGame =()=>{
    board = new Board()
    curX = -1
    curY = -1
    currentTeam = white
    setInterval(rePaintBoard, 1)  
}

onClick =async(e)=>{
    let chessCanvasX = chessCanvas.getBoundingClientRect().left
    let chessCanvasY = chessCanvas.getBoundingClientRect().top
    let x = Math.floor((e.clientX-chessCanvasX)/tileSize)
    let y = Math.floor((e.clientY-chessCanvasY)/tileSize)

    if(checkValidMovement(x, y) === true){
        if(!checkShahKingBeforeMove(x, y)){
            if(checkValidCapture(x, y) === true){
        
            }
            if(checkValidСastlingKing(x, y) === true){
                castlingKing(x, y)
                return
            }
            moveSelectedFigure(x, y)

            if(checkShahKing()){
                if(checkMateKing()){
                    console.log('МАТ')
                }
            }
            changeCurrentTeam()
        }
        else{
            console.log('СЮДА НЕЛЬЗЯ, БУДЕТ ШАХ')
            curX = -1 
            curY = -1
        }
    }
    else{
        curX = x 
        curY = y
        board.resetValidMoves()
        checkPossiblePlays()
    }
}

checkMateKing =()=>{
    console.log('проверка на мат')
    if(checkMoveKingAfterShah(drawShahKing.x, drawShahKing.y)){
        console.log('Есть ходы у короля')
    }else{
        console.log('Королю мат')
    }
}

checkMoveKingAfterShah =(curX, curY)=>{
    for(let i=-1; i < 2; i++){
        for(let j=-1; j < 2; j++){
            if(curY+j < 0 || curY+j >= boardHeight) continue
            if(curX+i < 0 || curX+i >= boardWidth) continue
            if(j === 0 && i === 0) continue
            if(board.validCheckMate[curY+j][curX+i] === invalid){
                if(board.tiles[curY+j][curX+i].teamColor === empty || board.tiles[curY+j][curX+i].teamColor === currentTeam ){
                    return true
                }
            }
        }
    }
    return false
}

checkShahKing = ()=>{
    board.resetValidCheckMate()
    for(let i=0; i < boardWidth; i++){
        for(let j=0; j < boardHeight; j++){
            if(board.tiles[j][i].teamColor === currentTeam){
                let figure = board.tiles[j][i].figureType
                if(figure === bishop) checkPossiblePlaysBishop(i, j, false, true)
                if(figure === pawn) checkPossiblePlaysPawn(i, j, false, true)
                if(figure === rook) checkPossiblePlaysRook(i, j, false, true)
                if(figure === horse) checkPossiblePlaysHorse(i, j, false, true)
                if(figure === queen) checkPossiblePlaysQueen(i, j, false, true)
                if(figure === king) checkPossiblePlaysKing(i, j, false, true)
            }
        }
    }

    for(let i=0; i < boardWidth; i++){
        for(let j=0; j < boardHeight; j++){           
            if(board.validCheckMate[j][i] === validCapture && board.tiles[j][i].figureType === king && board.tiles[j][i].teamColor !== currentTeam){
                drawShahKing = {x:i, y:j}
                console.log('ШАХ')
                console.log(board.validCheckMate)
                return true
            }
        }
    }
    console.log('ШАХ')
    console.log(board.validCheckMate)
    return false
}

checkShahKingBeforeMove = (x, y) =>{
    board.resetСheckShahKingBeforeMove()

    cloneBoard = JSON.parse(JSON.stringify(board))

    cloneBoard.tiles[y][x].figureType = cloneBoard.tiles[curY][curX].figureType
    cloneBoard.tiles[y][x].teamColor = cloneBoard.tiles[curY][curX].teamColor
    cloneBoard.tiles[curY][curX].figureType = empty
    cloneBoard.tiles[curY][curX].teamColor = empty
    
    for(let i=0; i < boardWidth; i++){
        for(let j=0; j < boardHeight; j++){
            if(cloneBoard.tiles[j][i].figureType !== empty && cloneBoard.tiles[j][i].teamColor !== currentTeam){
                if(cloneBoard.tiles[j][i].figureType === bishop) checkPossiblePlaysBishop(i, j, true, false)
                if(cloneBoard.tiles[j][i].figureType === pawn) checkPossiblePlaysPawn(i, j, true, false)
                if(cloneBoard.tiles[j][i].figureType === rook) checkPossiblePlaysRook(i, j, true, false)
                if(cloneBoard.tiles[j][i].figureType === horse) checkPossiblePlaysHorse(i, j, true, false)
                if(cloneBoard.tiles[j][i].figureType === queen) checkPossiblePlaysQueen(i, j, true, false)
                if(cloneBoard.tiles[j][i].figureType === king) checkPossiblePlaysKing(i, j, true, false)
            }
        }
    }

    for(let i=0; i < boardWidth; i++){
        for(let j=0; j < boardHeight; j++){
            if(cloneBoard.tiles[j][i].figureType === king && cloneBoard.tiles[j][i].teamColor === currentTeam){
                if(board.checkShahKingBeforeMove[j][i] === validCapture){
                    console.log('пре шах борд')
                    console.log(board.checkShahKingBeforeMove)
                    return true
                }
                else{
                    drawShahKing = {x:-1, y:-1}
                    console.log('пре шах борд')
                    console.log(board.checkShahKingBeforeMove)
                    return false
                }
            }
        }
    }
}

getPartnerColor = ()=>{
    if(currentTeam === white) partnerTeam = black
    else partnerTeam = white
}

checkPossiblePlaysPawn =(curX, curY, checkShah, shah)=>{    
    let direction
    if(checkShah){
        if(currentTeam === white) direction = 1
        else direction = -1
    }
    else{
        if(currentTeam === white) direction = -1
        else direction = 1
    }
    
    if(curY+direction < 0 || curY+direction > boardHeight-1) return
    
    if(curY === 6 || curY === 1){
        if(board.tiles[curY+direction][curX].teamColor === empty) checkPossibleMove(curX, curY+2*direction, checkShah, shah)
    }                
    checkPossibleMove(curX, curY+direction, checkShah, shah)
    

    if(curX-1 >= 0) checkPossibleCapture(curX-1, curY+direction, checkShah, shah)
    if(curX+1 !== boardWidth) checkPossibleCapture(curX+1, curY+direction, checkShah, shah)
}

checkPossiblePlaysBishop = (curX, curY, checkShah, shah)=>{
    for(let i=1; curX-i >= 0 && curY-i >= 0; i++){
        if(checkPossiblePlay(curX-i, curY-i, checkShah, shah)) break
    }
    for(let i=1; curX+i <= boardWidth-1 && curY+i <= boardHeight-1; i++){
        if(checkPossiblePlay(curX+i, curY+i, checkShah, shah)) break
    }
    for(let i=1; curX+i <= boardWidth-1 && curY-i >= 0; i++){
        if(checkPossiblePlay(curX+i, curY-i, checkShah, shah)) break
    }
    for(let i=1; curX-i >= 0 && curY+i <= boardHeight-1; i++){
        if(checkPossiblePlay(curX-i, curY+i, checkShah, shah)) break
    }  
}

checkPossiblePlaysRook = (curX, curY, checkShah, shah)=>{
    for(let i=1; curX-i >= 0; i++){
        if(checkPossiblePlay(curX-i, curY, checkShah, shah)) break
    }
    for(let i=1; curX+i <= boardWidth-1; i++){
        if(checkPossiblePlay(curX+i, curY, checkShah, shah)) break
    }
    for(let i=1; curY-i >= 0; i++){
        if(checkPossiblePlay(curX, curY-i, checkShah, shah)) break
    }
    for(let i=1; curY+i <= boardHeight-1; i++){
        if(checkPossiblePlay(curX, curY+i, checkShah, shah)) break
    }
}

checkPossiblePlaysQueen = (curX, curY, checkShah, shah)=>{
    checkPossiblePlaysBishop(curX, curY, checkShah, shah)
    checkPossiblePlaysRook(curX, curY, checkShah, shah)
}

checkPossiblePlaysHorse = (curX, curY, checkShah, shah)=>{
    if(curX-2 >= 0){
        if(curY-1 >= 0) checkPossiblePlay(curX-2, curY-1, checkShah, shah)
        if(curY+1 <= boardHeight-1) checkPossiblePlay(curX-2, curY+1, checkShah, shah)
    }
    if(curY-2 >= 0){
        if(curX-1 >= 0) checkPossiblePlay(curX-1, curY-2, checkShah, shah)
        if(curX+1 <= boardWidth-1) checkPossiblePlay(curX+1, curY-2, checkShah, shah)
    }
    if(curX+2 <= boardWidth-1){
        if(curY-1 >= 0) checkPossiblePlay(curX+2, curY-1, checkShah, shah)
        if(curY+1 <= boardHeight-1) checkPossiblePlay(curX+2, curY+1, checkShah, shah)
    }
    if(curY+2 <= boardHeight-1){
        if(curX-1 >= 0) checkPossiblePlay(curX-1, curY+2, checkShah, shah)
        if(curX+1 <= boardWidth-1) checkPossiblePlay(curX+1, curY+2, checkShah, shah)
    }
}

checkPossiblePlaysKing = (curX, curY, checkShah, shah)=>{
    for(let i=-1; i < 2; i++){
        for(let j=-1; j < 2; j++){
            if(curY+j < 0 || curY+j >= boardHeight) continue
            if(curX+i < 0 || curX+i >= boardWidth) continue
            if(j === 0 && i === 0) continue
            checkPossiblePlay(curX+i, curY+j, checkShah, shah)
        }
    }
}

checkPossibleCastlingKing = ()=>{
    let stop = false
    if(board.tiles[curY][curX-4].figureType === rook && board.tiles[curY][curX-4].noMove){
        for(let i=1; i < 4; i++){
          if(board.tiles[curY][curX-i].figureType !== empty) stop = true  
        }
        if(!stop){
            drawCircle(curX-3,curY, highLightColor)
            board.validMoves[curY][curX-3] = castling
        }
    }
    if(board.tiles[curY][curX+3].figureType === rook && board.tiles[curY][curX+3].noMove){
        for(let i=1; i < 3; i++){
            if(board.tiles[curY][curX+i].figureType !== empty) return  
        }
          drawCircle(curX+2,curY, highLightColor)
          board.validMoves[curY][curX+2] = castling
    }
}

checkPossiblePlay = (x, y, checkShah, shah)=>{
    if(checkPossibleCapture(x, y, checkShah, shah)) return true
    if(!checkPossibleMove(x, y, checkShah, shah)) return true
    
}

checkPossibleCapture =(x, y, checkShah, shah)=>{
    if(checkShah && cloneBoard.tiles[y][x].teamColor === currentTeam && cloneBoard.tiles[y][x].teamColor !== empty){
        board.checkShahKingBeforeMove[y][x] = validCapture
        return true
    }

    if(shah && board.tiles[y][x].teamColor !== empty){
        board.validCheckMate[y][x] = validCapture
        return true
    } 

    if(!shah && !checkShah){
        if(board.tiles[y][x].teamColor === currentTeam || board.tiles[y][x].teamColor === empty) return false
        board.validMoves[y][x] = validCapture
        drawCorners(x, y, highLightColor)
        return true
    }
    return false
}

checkPossibleMove =(x, y, checkShah, shah)=>{
    if(!checkShah && !shah){
        if(board.tiles[y][x].teamColor !== empty ) return false
        board.validMoves[y][x] = valid
        drawCircle(x, y, highLightColor)
    }

    if(checkShah){
        if(cloneBoard.tiles[y][x].teamColor !== empty ) return false
        board.checkShahKingBeforeMove[y][x] = valid
    }

    if(shah){
        if(board.tiles[y][x].teamColor !== empty ) return false
        board.validCheckMate[y][x] = valid
    } 
    return true
} 

castlingKing =(x, y)=>{
    if(x === 1){
        board.tiles[y][x].teamColor = board.tiles[curY][curX].teamColor
        board.tiles[y][x].figureType = board.tiles[curY][curX].figureType
        board.tiles[y][x].noMove = false
        board.tiles[y][x+1].teamColor = board.tiles[curY][curX-4].teamColor
        board.tiles[y][x+1].figureType = board.tiles[curY][curX-4].figureType
        board.tiles[y][x+1].noMove = false

        board.tiles[curY][curX-4].teamColor = empty
        board.tiles[curY][curX-4].figureType = empty
        board.tiles[curY][curX].teamColor = empty
        board.tiles[curY][curX].figureType = empty
    }
    if(x === 6){
        board.tiles[y][x].teamColor = board.tiles[curY][curX].teamColor
        board.tiles[y][x].figureType = board.tiles[curY][curX].figureType
        board.tiles[y][x].noMove = false
        board.tiles[y][x-1].teamColor = board.tiles[curY][curX+3].teamColor
        board.tiles[y][x-1].figureType = board.tiles[curY][curX+3].figureType
        board.tiles[y][x-1].noMove = false

        board.tiles[curY][curX+3].teamColor = empty
        board.tiles[curY][curX+3].figureType = empty
        board.tiles[curY][curX].teamColor = empty
        board.tiles[curY][curX].figureType = empty
    }
    curX = -1
    curY = -1
    board.resetValidMoves()
    changeCurrentTeam()
}

moveSelectedFigure =(x, y)=>{
    
    board.tiles[y][x].figureType = board.tiles[curY][curX].figureType
    board.tiles[y][x].teamColor = board.tiles[curY][curX].teamColor
    board.tiles[curY][curX].teamColor = empty
    board.tiles[curY][curX].figureType = empty

    if((board.tiles[y][x].figureType === rook || board.tiles[y][x].figureType === king) && board.tiles[y][x].noMove === true){
        board.tiles[y][x].noMove = false
    } 
    board.resetValidMoves()
    curX = -1
    curY = -1
}

changeCurrentTeam =()=>{
    if(currentTeam === white){
        currentTeam = black
    }
    else{
        currentTeam = white
    }
}

checkValidСastlingKing =(x, y)=>{
    if(board.validMoves[y][x] === castling) return true
    return false
}

checkValidCapture =(x, y)=>{
    if(board.validMoves[y][x] === validCapture) return true
    else return false
}

checkValidMovement =(x, y)=>{
    if(board.validMoves[y][x] === valid || board.validMoves[y][x] === validCapture || board.validMoves[y][x] === castling) return true
    else return false
}

checkPossiblePlays =()=>{
    if(curX < 0 || curY < 0) return
    let tile = board.tiles[curY][curX]
    if(tile.teamColor === empty || tile.teamColor !== currentTeam) return
    
    drawTile(curX, curY, highLightColor)
    if(tile.figureType === pawn) checkPossiblePlaysPawn(curX, curY)
    else if(tile.figureType === bishop ) checkPossiblePlaysBishop(curX, curY)
    else if(tile.figureType === rook ) checkPossiblePlaysRook(curX, curY)
    else if(tile.figureType === horse ) checkPossiblePlaysHorse(curX, curY)
    else if(tile.figureType === queen ) checkPossiblePlaysQueen(curX, curY)
    else if(tile.figureType === king ){
        checkPossiblePlaysKing(curX, curY)
        if(tile.noMove) checkPossibleCastlingKing() 
    } 
}

rePaintBoard =()=>{
    drawBoard()
    checkPossiblePlays()
    if(drawShahKing.x >= 0) drawTile(drawShahKing.x, drawShahKing.y, 'red')
    drawFigures()
}

drawBoard =()=>{
    for(let i=0; i < boardHeight; i++){
        for(let j=0; j < boardWidth; j++){
            if((i+j)%2 === 1){
                drawTile(j, i, blackTileColor)
            }
            else drawTile(j, i, whiteTileColor) 
        }
    }
}

drawTile =(x, y, fillStyle)=>{
    ctx.fillStyle = fillStyle
    ctx.fillRect(tileSize*x, tileSize*y, tileSize, tileSize)
}

drawCircle =(x, y, fillStyle)=>{
    ctx.fillStyle = fillStyle
    ctx.beginPath()
    ctx.arc(tileSize*(x+0.5), tileSize*(y+0.5), tileSize/8, 0, 2*Math.PI)
    ctx.fill()
}

drawCorners =(x, y, fillStyle)=>{
    ctx.fillStyle = fillStyle

    ctx.beginPath()
    ctx.moveTo(tileSize*x, tileSize*y)
    ctx.lineTo(tileSize*x+tileSize/4, tileSize*y)
    ctx.lineTo(tileSize*x, tileSize*y+tileSize/4)
    ctx.fill()

    ctx.beginPath()
    ctx.moveTo(tileSize*(x+1), tileSize*y)
    ctx.lineTo(tileSize*(x+1)-tileSize/4, tileSize*y)
    ctx.lineTo(tileSize*(x+1), tileSize*y+tileSize/4)
    ctx.fill()

    ctx.beginPath()
    ctx.moveTo(tileSize*(x+1), tileSize*(y+1))
    ctx.lineTo(tileSize*(x+1)-tileSize/4, tileSize*(y+1))
    ctx.lineTo(tileSize*(x+1), tileSize*(y+1)-tileSize/4)
    ctx.fill()

    ctx.beginPath()
    ctx.moveTo(tileSize*x, tileSize*(y+1))
    ctx.lineTo(tileSize*x+tileSize/4, tileSize*(y+1))
    ctx.lineTo(tileSize*x, tileSize*(y+1)-tileSize/4)
    ctx.fill()
}

drawFigures =()=>{
        for(let i=0; i < boardHeight; i++){
            for(let j=0; j < boardWidth; j++){
                if(board.tiles[i][j].teamColor === empty) continue
                let figureType = board.tiles[i][j].figureType
                if(board.tiles[i][j].teamColor === white){
                    ctx.drawImage(FigureImage.white[figureType], tileSize*(j), tileSize*(i), tileSize/1, tileSize/1)
                } 
                else 
                    ctx.drawImage(FigureImage.black[figureType], tileSize*(j), tileSize*(i), tileSize/1, tileSize/1)
            }
        }
    
}

class Board{
    constructor(){
        this.tiles = []
        this.tiles.push([
            new Tile(rook, black),
            new Tile(horse, black),
            new Tile(bishop, black),
            new Tile(queen, black),
            new Tile(king, black),
            new Tile(bishop, black),
            new Tile(horse, black),
            new Tile(rook, black),
        ],[
            new Tile(pawn, black),
            new Tile(pawn, black),
            new Tile(pawn, black),
            new Tile(pawn, black),
            new Tile(pawn, black),
            new Tile(pawn, black),
            new Tile(pawn, black),
            new Tile(pawn, black),
        ])
        for(let i=0; i<4; i++){
            this.tiles.push([
                new Tile(empty, empty),
                new Tile(empty, empty),
                new Tile(empty, empty),
                new Tile(empty, empty),
                new Tile(empty, empty),
                new Tile(empty, empty),
                new Tile(empty, empty),
                new Tile(empty, empty),
            ])
        }
        this.tiles.push([
            new Tile(pawn, white),
            new Tile(pawn, white),
            new Tile(pawn, white),
            new Tile(pawn, white),
            new Tile(pawn, white),
            new Tile(pawn, white),
            new Tile(pawn, white),
            new Tile(pawn, white),
        ],[
            new Tile(rook, white),
            new Tile(horse, white),
            new Tile(bishop, white),
            new Tile(queen, white),
            new Tile(king, white),
            new Tile(bishop, white),
            new Tile(horse, white),
            new Tile(rook, white),       
        ])
        this.validMoves = []
        for(let i=0; i<boardHeight; i++){
            this.validMoves.push([
                invalid,
                invalid,
                invalid,
                invalid,
                invalid,
                invalid,
                invalid,
                invalid
            ])
        }
        this.validCheckMate = []
        for(let i=0; i<boardHeight; i++){
            this.validCheckMate.push([
                invalid,
                invalid,
                invalid,
                invalid,
                invalid,
                invalid,
                invalid,
                invalid
            ])
        }
        this.checkShahKingBeforeMove = []
        for(let i=0; i<boardHeight; i++){
            this.checkShahKingBeforeMove.push([
                invalid,
                invalid,
                invalid,
                invalid,
                invalid,
                invalid,
                invalid,
                invalid
            ])
        }
    }
    resetСheckShahKingBeforeMove(){
        for(let i=0; i < boardHeight; i++){
            for(let j=0; j < boardWidth; j++){
                this.checkShahKingBeforeMove[i][j] = invalid
            }
        }
    }
    resetValidCheckMate(){
        for(let i=0; i < boardHeight; i++){
            for(let j=0; j < boardWidth; j++){
                this.validCheckMate[i][j] = invalid
            }
        }
    }
    resetValidMoves(){
        for(let i=0; i < boardHeight; i++){
            for(let j=0; j < boardWidth; j++){
                this.validMoves[i][j] = invalid
            }
        }
    }
}

class Tile{
    constructor(figureType, teamColor){
        this.figureType = figureType
        this.teamColor = teamColor
        if(figureType === king || figureType === rook) this.noMove = true
    }
}

// boardCheckShah=()=>{

// }
   
