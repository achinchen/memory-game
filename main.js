new Vue({
  el: '#app',
  data() {
    return {
      level: 0,
      score: 0,
      flopTimes: 0,
      detectorID: null,
      userStatus: false,
      isFinishedGame: false,
      isPlayingMode: false,
      cardSetting: {
        colors: [ 'blue', 'green', 'pink', 'yellow' ],
        shapes: [ 'diamond', 'oval', 'rectangle', 'triangle' ]
      },
      levelSetting: [
        { shape: 2, color: 1, quantity: 8, tradeOff: null },
        { shape: 1, color: 2, quantity: 8, tradeOff: null },
        { shape: 3, color: 2, quantity: 12, tradeOff: 'shape' },
        { shape: 2, color: 3, quantity: 12, tradeOff: 'color' },
        { shape: 4, color: 4, quantity: 12, tradeOff: 'all' },
        { shape: 4, color: 4, quantity: 12, tradeOff: 'all' }
      ],
      answerCardList: [...Array(8)].fill(
        { url: '', shape: '', card: '',  isSelected: null, isFoundPairs: false })
    }
  },
  mounted() {

  },
  computed: {
    currentLevelSetting() {
      return this.levelSetting[parseInt(this.level)]
    },
    selectedCards() {
      return this.answerCardList.filter(card => !card.isFoundPairs && card.isSelected)
    },
    isFinishedCurrentLevel() {
      return this.answerCardList.filter(card => card.isFoundPairs).length
               == this.currentLevelSetting.quantity
    }
  },
  methods: {
    detectUserStatus(evt) {
      if(!this.userStatus) {
        clearInterval(this.detectorID)
      }
    },
    activatedGame() {
      if(this.isPlayingMode) {
        this.stopGame()
      } else {
        this.startGame()
      }
      this.userStatus = true
    },
    stopGame() {
      this.isPlayingMode = false
    },
    checkFoundPairs() {
      if(this.currentLevelSetting.tradeOff) {
        let tradeOff = this.currentLevelSetting.tradeOff
        let basic = tradeOff == 'color' ? 'shape' : 'color'
        // selectedCards.reduce((previousCard, currentValueCard) => {
        //   previousCard[basic] == currentValueCard[basic] 
        // })
      } else if(this.selectedCards.length == 2){
        this.selectedCards.reduce((previousCard, currentValueCard) => {
          if(previousCard.url == currentValueCard.url) {
            this.score += 1
            previousCard.isFoundPairs = true
            currentValueCard.isFoundPairs = true
          }
        })
      }
    },
    startGame() {
      if(this.level == 6 ) {
        this.level = 0
        this.isFinishedGame = true
        console.log(`finish game, your score is ${this.score}`)
      } else {
        this.level += 1
        this.setAnswerOfLevel()
      }
      setTimeout(() => this.answerCardList.forEach(card => card.isSelected = true), 10)
      setTimeout(() => this.answerCardList.forEach(card => card.isSelected = false), 1000)
      this.isPlayingMode = true
      this.setDetectorForSelectedClass()
    },
    pickCardUp(index) {
      if(this.isPlayingMode) {
        let currentCard = this.answerCardList[index]
        currentCard.isSelected = true
        this.flopTimes += 1
        this.checkFoundPairs()
        this.dropCardBack()
        if(this.isFinishedCurrentLevel) this.switchPlayingMode()
      }
    },
    dropCardBack() {
      this.selectedCards.forEach(card => {
        if(!card.isFoundPairs) setTimeout(() => card.isSelected = false, 1000)
      })
    },
    switchPlayingMode() {
      clearInterval(this.detectorID)
      setTimeout(() => this.answerCardList.forEach(card => card.isSelected = false), 2000)
      setTimeout(() => this.isPlayingMode = false, 1000)
    },
    setDetectorForSelectedClass() {
      if(this.isPlayingMode) {
        this.detectorID = setInterval(() => {
          this.setSelectedClass()
          console.log(`hello, it's me`)
        }, 200)
      }
    },
    setSelectedClass() {
      this.answerCardList.forEach(card => {
        if(card.isFoundPairs && !card.isSelected) card.isSelected = true
      })
    },
    setAnswerOfLevel() {
      const cardGroup = this.setCardGroup(this.currentLevelSetting)
      const answerCardGroup = this.setAnswerCardGroup(cardGroup, this.currentLevelSetting)
      this.answerCardList = this.setAnswerCardList(answerCardGroup, this.currentLevelSetting)
    },
    setCardGroup({ color, shape }) {
      const colorList = this.getMaterialList(this.cardSetting.colors, color)
      const shapeList = this.getMaterialList(this.cardSetting.shapes, shape)
      let tempCardGroup = []
      colorList.forEach(colorItem =>
        shapeList.forEach(shapeItem =>
          tempCardGroup.push({
            url: `${shapeItem}-${colorItem}.svg`,
            shape: shapeItem,
            color: colorItem,
            isSelected: false,
            isFoundPairs: false
          })
        )
      )
      return tempCardGroup
    },
    setAnswerCardGroup(cardGroup, { quantity }) {
      const sequence = this.getShuffleArray(cardGroup.length, quantity / 2)
      return sequence.map(order => cardGroup[order])
    },
    setAnswerCardList(answerCardGroup, { quantity }) {
      const tempAnswerCardGroup = this.getFilledArray(quantity, answerCardGroup)
      const sequence = this.getShuffleArray(quantity, quantity)
      return sequence.map(order => ({...tempAnswerCardGroup[order]}))
    },
    getFilledArray(totalNumber, FilledArray) {
      return [...Array(totalNumber)].map(
        (item, index) => FilledArray[index % FilledArray.length])
    },
    getMaterialList(data, count) {
      let sequenceArray = this.getShuffleArray(4, count)
      return sequenceArray.map(order => data[order])
    },
    getShuffleArray(totalNumber, count) {
      return [...Array(totalNumber).keys()]
        .sort(() => 0.5 - Math.random())
        .slice(0, count)
    }
  }
})