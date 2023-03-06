function Stacker() {
  var EMPTY = 0,
    WALL = 1,
    BLOCK = 2,
    GOLD = 3;

  //define variables to keep track of the state of the game
  let self = this;
  let direction = 'right';
  let blockCOunt = 0;
  let blockPositions = [];

  //define a helper function to check if the troll can move in a certain direction
  function canMoveTo(cell, dir) {
    return cell[dir].type !== WALL && cell[dir].level <= cell.level + 1;
  }

  //helper function to move the troll in a certain direction
  function move(direction) {
    return self[direction]();
  }

  //helper function to pickup a block and increment the block count
  function pickup() {
    blockCount++;
    return 'pickup';
  }

  //helper function to drop a block, decrement the block count, and add the block to the staircase
  function drop() {
    blockCount--;
    blockPositions.push({
      x: currentCell.x,
      y: currentCell.y,
      level: currentCell.level + 1,
    });
    return 'drop';
  }

  //helper function to get the next step for the troll to take
  function getNextStep() {
    let blockPos = blockPositions.find(
      (block) => block.x === currentCell.x && block.y === currentCell.y
    );

    if (blockPos) {
      //if the troll is on a block, return the next step to take
      if (currentCell.level === blockPos.level) {
        return 'pickup';
      }

      if (currentCell.level < blockPos.level) {
        if (canMoveTo(currentCell, 'up')) {
          return 'up';
        }
      }

      if (currentCell.level > blockPos.level) {
        if (canMoveTo(currentCell, 'down')) {
          return 'down';
        }
      }
    } else {
      //if the troll is not on a block, move towards the tower
      let towerX, towerY;
      for (let i = 0; i < 5; i++) {
        for (let j = 0; j < 5; j++) {
          if (currentCell.up.up.up[i][j].type === GOLD) {
            towerX = j;
            towerY = i;
            break;
          }
        }
      }

      if (currentCell.x < towerX) {
        if (canMoveTo(currentCell, 'right')) {
          return 'right';
        }
      } else if (currentCell.x > towerX) {
        if (canMoveTo(currentCell, 'left')) {
          return 'left';
        }
      } else if (currentCell.y < towerY) {
        if (canMoveTo(currentCell, 'down')) {
          return 'down';
        }
      } else if (currentCell.y > towerY) {
        if (canMoveTo(currentCell, 'up')) {
          return 'up';
        }
      }
    }
    //if there are no moves possible, return null
    return null;
  }

  //define the turn method that the simulator will call each turn
  this.turn = function (cell) {
    //update the current cell and get the next step for the troll
    currentCell = cell;
    let nextStep = getNextStep();

    //if the next step is to pick up a block, call the pickup function
    if (nextStep === 'pickup') {
      return pickup();
    }

    //if the next step is to drop a block, call the drop function
    else if (nextStep === 'drop') {
      return drop();
    }

    //if the next step is a valid move, update the direction and call the move
    else if (nextStep) {
      direction = nextStep;
      return move(direction);
    }

    //if there are no moves possible, return "pass"
    else {
      return 'pass';
    }
  };
}
