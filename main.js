class Cards {
  constructor() {
    this.colors = [ 'blue', 'green', 'pink', 'yellow' ]
    this.shapes = [ 'diamond', 'oval', 'rectangle', 'triangle' ]
  }
  get cardList() {
    return this.getCardList()
  }
  getCardList() {
    let list = []
    this.colors.forEach(color => {
      this.shapes.forEach(shape => {
        list.push({ cardImage: `${shape}-${color}.svg`, color, shape })
      })
    })
    return list
  }
}

class Game {
  constructor() {
    this.cards = new Cards()
    this.allCards = document.querySelectorAll('.card-back')
  }
  get levels() {
    return this.getLevels()
  }
  getLevels() {
    let randomLevels = []
    
  }
}

let game = new Game()