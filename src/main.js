;(function(Vue) {
  new Vue({
    el: '#app',
    data() {
      return {
        timer: 800,
        level: 0,
        score: 0,
        flopTimes: 0,
        isPlayingMode: false,
        cardSetting: {
          colors: [ 'blue', 'green', 'pink', 'yellow' ],
          shapes: [ 'diamond', 'oval', 'rectangle', 'triangle' ]
        },
        levelSetting: [
          { shape: 2, color: 1, quantity: 12 },
          { shape: 1, color: 2, quantity: 12 },
          { shape: 2, color: 1, quantity: 12 },
          { shape: 1, color: 2, quantity: 12 },
          { shape: 3, color: 2, quantity: 12 },
          { shape: 2, color: 3, quantity: 12 },
          { shape: 3, color: 2, quantity: 12 },
          { shape: 2, color: 3, quantity: 12 },
          { shape: 4, color: 4, quantity: 12 },
          { shape: 4, color: 4, quantity: 12 }
        ],
        notifications: [],
        currentSelectedCards: [],
        answerCardList: [...Array(12)].fill(
          { url: 'diamond-blue.svg', shape: '', card: '',  isSelected: false, isFoundPairs: false, isEnabled: false })
      }
    },
    computed: {
      lessTimer() {
        return this.timer - 200
      },
      moreTimer() {
        return this.timer * 4
      },
      currentLevelSetting() {
        return this.levelSetting[parseInt(this.level) - 1]
      },
      foundPairsQuantity() {
        return this.answerCardList.filter(({isFoundPairs}) => isFoundPairs).length
      },
      isFinishCurrentLevel() {
        return this.foundPairsQuantity == this.answerCardList.length
      },
      isFinishAllLevel: {
        get() {
          return this.level == 10 && this.isFinishCurrentLevel
        },
        set() {
          this.replayGame()
        }
      },
      displayLevel() {
        return this.level.toString().padStart(3, 0)
      },
      displayScore() {
        return this.score.toString().padStart(3, 0)
      },
      displayNameOfButton() {
        return !this.isPlayingMode ? 'Start' : 'Replay'
      }
    },
    methods: {
      triggerGame() {
        this.isFinishAllLevel || this.isPlayingMode
          ? this.isFinishAllLevel = false
          : this.playGame()
      },
      playGame() {
        this.level += 1
        this.setAnswerOfLevel()
        setTimeout(() => {
          this.foldBackCard(true)
          setTimeout(() => this.foldBackCard(), this.moreTimer)
          setTimeout(() => this.isPlayingMode = true, this.lessTimer)
        }, this.lessTimer)
      },
      stopGame() {
        this.level = 0
        this.flop = 0
        this.score = 0
        this.isPlayingMode = false
        this.foldBackCard()
      },
      replayGame() {
        this.stopGame()
        setTimeout(() => this.playGame(), this.timer)
      },
      pickCardUp(index) {
        if(this.isPlayingMode) {
          this.multiplyClickDetector(index)
          let currentCard = this.answerCardList[index]
          const { isEnabled, isSelected, isFoundPairs } = currentCard
          if (isEnabled && !( isSelected || isFoundPairs)) {
            this.flopTimes += 1
            currentCard.isSelected = true
            this.currentSelectedCards.push({...currentCard, index})
            this.foundPairsDetector()
          }
        }
      },
      multiplyClickDetector(index) {
        const currentCard = this.answerCardList[index]
        if (!currentCard.isFoundPairs) {
          currentCard.isEnabled = true
          setTimeout(() => currentCard.isEnabled = false, this.timer)
        }
      },
      foundPairsDetector() {
        const length = this.currentSelectedCards.length
        if (length > 1) {
          if (length > 2) {
            this.selectedCardDetector()
            this.currentSelectedCards = []
          } else {
            this.scoreCalculator()
            setTimeout(() => this.currentSelectedCards = [], this.timer)
          }
        }
      },
      scoreCalculator() {
        let flagOfFoundPairs = false
        const firstCard = this.currentSelectedCards[0]
        const secondCard = this.currentSelectedCards[1]
        flagOfFoundPairs = firstCard.color == secondCard.color && firstCard.shape == secondCard.shape
        if (flagOfFoundPairs) this.notificationsAndScoreSetter(2)
        this.attributeOfSelectedCardSetter(flagOfFoundPairs)
      },
      attributeOfSelectedCardSetter(flagOfFoundPairs) {
        const changedKey = flagOfFoundPairs ? 'isFoundPairs' : 'isSelected'
        this.currentSelectedCards.forEach(({index}) => {
          setTimeout(() => this.answerCardList[index][changedKey] = flagOfFoundPairs,
            flagOfFoundPairs ? 0 : this.lessTimer)
        })
        setTimeout(() => { if(this.isFinishCurrentLevel) this.levelCalculator() }, this.timer)
      },
      selectedCardDetector() {
        this.answerCardList.forEach((card) => { if (!card.isFoundPairs) card.isSelected = false })
      },
      foldBackCard(Selected = false) {
        this.answerCardList.forEach((card) => card.isSelected = Selected)
      },
      levelCalculator() {
        this.isPlayingMode = false
        setTimeout(() => this.bonusCalculator(), this.lessTimer)
        if(!this.isFinishAllLevel) {
          setTimeout(() => this.foldBackCard(), this.moreTimer / 2)
          setTimeout(() => this.triggerGame(), this.moreTimer)
        }
      },
      bonusCalculator() {
        const length = this.answerCardList.length
        this.notificationsAndScoreSetter(
          this.flopTimes == length ? 5 : this.flopTimes < length * 1.5 ? 3 : 1)
        this.flopTimes = 0
      },
      notificationsAndScoreSetter(score) {
        this.notifications.push(score)
        this.score += score
        setTimeout(() => this.notifications.shift(), this.timer)
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
              isFoundPairs: false,
              isEnabled: false
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
})(Vue)