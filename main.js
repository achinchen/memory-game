class Cards {
  constructor(value) {
    this.colors = [ 'blue', 'green', 'pink', 'yellow' ]
    this.shapes = ['diamond', 'oval', 'rectangle', 'triangle']
    this.allOn = false
    this.allCards = document.querySelectorAll('.card-back')
    this.setCards = () => {
      this.allCards.forEach(card => {
        // card.style.backgroundImage = 
      })
    }
  }
}
var cards = new Cards()