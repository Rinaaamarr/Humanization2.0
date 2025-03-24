document.addEventListener('DOMContentLoaded', () => {
  drag_lever()
  typewriter()
  scroll()
  synchronization()
  setupEmotions()
  contenteditable()
  chooseQualities()
  backgrounds()
  placeOrder()
  //  Adaptives' functions
  typewriter_1024()
  drag_lever_1024()
  scroll_1024()
})

// typewriter
function typewriter() {
  let typed = new Typed('#typewriter', {
    strings: ['Hi!', 'Welcome!'],
    typeSpeed: 200,
    backSpeed: 100,
    backDelay: 1000,
    loop: true
  })
}

// drag-lever
function drag_lever() {
  let slider = createSlider(
    0,
    100,
    document.querySelector('.path-moving'),
    document.querySelector('.lever')
  )
  slider.setValue(100)

  function createSlider(min, max, element, thumb) {
    let slider = {
      min: 0,
      max: 100,
      value: min,
      element: document.querySelector('.path-moving'),
      thumb: document.querySelector('.lever')
    }

    let currentMoveHandler = null

    let handleMouseMove = (event) => {
      let pathRect = element.getBoundingClientRect()

      let y = event.clientY - pathRect.top

      let leverHeight = thumb.offsetHeight
      let maxY = pathRect.height - leverHeight + (4 * window.innerWidth) / 100
      let minY = -(leverHeight * 0.67)
      y = Math.max(minY, Math.min(maxY, y))

      thumb.style.top = `${(y * 100) / window.innerWidth}vw`

      thumb.style.left = '2.4vw'

      slider.value = max - ((y - minY) / (maxY - minY)) * (max - min)

      event.preventDefault()
    }

    let handleMouseUp = () => {
      if (currentMoveHandler) {
        document.removeEventListener('mousemove', currentMoveHandler)
        document.removeEventListener('mouseup', handleMouseUp)
        currentMoveHandler = null
      }
    }

    let handleMouseDown = (event) => {
      currentMoveHandler = handleMouseMove
      document.addEventListener('mousemove', currentMoveHandler)
      document.addEventListener('mouseup', handleMouseUp)
      event.preventDefault()
    }

    thumb.addEventListener('mousedown', handleMouseDown)

    slider.setValue = (value) => {
      value = Math.max(slider.min, Math.min(slider.max, value))
      let pathRect = element.getBoundingClientRect()
      let leverHeight = thumb.offsetHeight
      let maxY = pathRect.height - leverHeight + (4 * window.innerWidth) / 100
      let minY = -(leverHeight * 0.67)
      let y =
        ((slider.max - value) / (slider.max - slider.min)) * (maxY - minY) +
        minY

      thumb.style.top = `${(y * 100) / window.innerWidth}vw`

      thumb.style.left = '2.4vw'

      slider.value = value
    }

    slider.getValue = () => slider.value
    slider.getId = () => slider.element.id

    return slider
  }
}

// scrolling
function scroll() {
  let buttonStart = document.querySelector('.button-start')

  if (!buttonStart) return

  buttonStart.addEventListener('click', () => {
    let targetSection = document.getElementById('choose-character')

    let headerHeight = -830

    window.scrollTo({
      top: targetSection.offsetTop - headerHeight,
      behavior: 'smooth'
    })
  })
}

// choosing, synchronization, scan, button state
function synchronization() {
  let currentlySelected = null
  let isCharacterConfirmed = false
  let scanCount = 0

  let elements = {
    buttonConfirm: document.querySelector('.button-confirm'),
    confirmText: document.querySelector('.confirm'),
    buttonScan: document.querySelector('.button-scan'),
    buttonPlaceOrder: document.querySelector('.button-place_order'),
    buttonRestart: document.querySelector('.button-restart'),
    scanner: document.querySelector('.scanner')
  }

  elements.buttonPlaceOrder.style.cursor = 'not-allowed'
  elements.buttonRestart.style.cursor = 'not-allowed'

  function setupCharacter(characterClass, selectionClass) {
    let character = document.querySelector(`.${characterClass}`)
    let selection = document.querySelector(`.${selectionClass}`)

    character.addEventListener('click', () => {
      if (isCharacterConfirmed) {
        alert(
          'К сожалению, вы не можете изменить персонажа после выбора. Вы можете обновить страницу, чтобы выбрать другого персонажа.'
        )
        return
      }
      document
        .querySelectorAll('.select1, .select2, .select3, .select4')
        .forEach((select) => {
          select.style.opacity = '0'
        })

      selection.style.opacity = '1'

      document
        .querySelectorAll('.robo-girl, .robo-boy, .dog, .robo-alien')
        .forEach((character) => {
          character.classList.remove('selected')
        })

      character.classList.add('selected')
      currentlySelected = selection

      elements.buttonConfirm.classList.add('active')
      elements.confirmText.style.cursor = 'pointer'

      let characterMap = {
        select1: 'girl',
        select2: 'boy',
        select3: 'dog',
        select4: 'alien'
      }
      let newCharacter = characterMap[selectionClass]
      handleCharacterChange(newCharacter)
    })
  }

  function handleCharacterChange(newCharacter) {
    document.querySelectorAll('.character-display').forEach((img) => {
      if (img.closest('#choose-character')) {
        img.style.opacity = '1'
      } else {
        img.style.opacity = '0'
        img.classList.remove('selected')
      }
    })
  }

  let characterSelections = [
    ['robo-girl', 'select1'],
    ['robo-boy', 'select2'],
    ['dog', 'select3'],
    ['robo-alien', 'select4']
  ]
  characterSelections.forEach(([character, selection]) =>
    setupCharacter(character, selection)
  )

  elements.buttonConfirm.addEventListener('click', () => {
    if (!currentlySelected) {
      alert('Пожалуйста, выберите персонажа!')
      return
    }

    let characterMap = {
      select1: 'girl',
      select2: 'boy',
      select3: 'dog',
      select4: 'alien'
    }
    let selectedCharacterAttribute =
      characterMap[currentlySelected.classList[0]]

    updateCharacterDisplays(selectedCharacterAttribute)
    enableButtons()
    scrollToScanSection()
    enableContenteditable()
  })

  function updateCharacterDisplays(selectedCharacterAttribute) {
    document.querySelectorAll('.character-display').forEach((img) => {
      if (img.closest('#choose-character')) {
        img.style.opacity = '1'
      } else {
        let isSelected = img.dataset.character === selectedCharacterAttribute
        img.style.opacity = isSelected ? '1' : '0'
        img.classList.toggle('selected', isSelected)
      }
    })
  }

  function enableButtons() {
    elements.buttonScan.classList.add('active')
    elements.buttonScan.style.cursor = 'pointer'
    elements.buttonPlaceOrder.classList.add('active')
    elements.buttonPlaceOrder.style.cursor = 'pointer'
    elements.buttonRestart.classList.add('active')
    elements.buttonRestart.style.cursor = 'pointer'

    document
      .querySelectorAll('.love, .sadness, .blush, .anger, .surprise, .disgust')
      .forEach((button) => {
        if (button) {
          button.style.cursor = 'pointer'
        }
      })
    isCharacterConfirmed = true
  }

  function scrollToScanSection() {
    let scanRobotSection = document.querySelector('.scan-robot')
    scanRobotSection?.scrollIntoView({ behavior: 'smooth' })
  }

  document.body.addEventListener('click', (event) => {
    let buttonScan = event.target.closest('.button-scan.active')
    if (buttonScan && isCharacterConfirmed) {
      startScan()
    }
  })

  function startScan() {
    elements.scanner.classList.add('scanning')
    scanCount++
    console.log('Scanning started!', `Scan Count: ${scanCount}`)
  }

  elements.scanner.addEventListener('animationend', () => {
    console.log('Animation ended!')
    elements.scanner.classList.remove('scanning')

    if (scanCount === 1) {
      showBugs()
      alert(
        'Внимание! Были обнаружены неполадки в системе. Устраните их как можно скорее!'
      )
    } else if (scanCount === 2) {
      alert('Неполадки устранены! Можно двигаться дальше.')
      hideAllBugs()
      scanCount = 0
    }
  })

  function showBugs() {
    let selectedImage = document.querySelector('.characters img.selected')

    let selectedCharacter = selectedImage.dataset.character
    console.log('Showing bugs for character:', selectedCharacter)

    document.querySelectorAll('.bug').forEach((bug) => {
      bug.style.opacity = '0'
    })

    document.querySelectorAll('.bug').forEach((bug) => {
      let shouldShow =
        bug.dataset.character === selectedCharacter ||
        (bug.dataset.character === 'default' &&
          !document.querySelector(
            `.bug[data-character="${selectedCharacter}"]`
          ))
      bug.style.opacity = shouldShow ? '1' : '0'
      console.log(`Bug ${bug.className}: ${shouldShow ? 'shown' : 'hidden'}`)
    })

    setupBugClickHandlers()
  }

  function hideAllBugs() {
    document.querySelectorAll('.bug').forEach((bug) => {
      bug.style.opacity = '0'
    })
  }

  function setupBugClickHandlers() {
    document.querySelectorAll('.bug').forEach((bug) => {
      bug.addEventListener('click', () => {
        bug.style.opacity = '0'
        checkAllBugsFixed()
      })
    })
  }

  function checkAllBugsFixed() {
    let remainingBugs = Array.from(document.querySelectorAll('.bug')).filter(
      (bug) => bug.style.opacity === '1'
    )

    if (remainingBugs.length === 0) {
      alert('Отлично! Попробуйте просканировать персонажа снова.')
    }
  }

  function resetGame() {
    if (!elements.buttonRestart.classList.contains('active')) {
      console.log('Reset button is not active')
      return
    }

    console.log('Resetting game...')
    window.location.replace(window.location.pathname)
  }

  function resetButtons() {
    elements.buttonScan.classList.add('active')
    elements.buttonScan.style.cursor = 'pointer'
    elements.buttonPlaceOrder.classList.remove('active')
    elements.buttonPlaceOrder.style.cursor = 'not-allowed'
    elements.buttonRestart.classList.add('active')
    elements.buttonRestart.style.cursor = 'pointer'
  }

  function resetCharacterSelection() {
    currentlySelected = null
    isCharacterConfirmed = false

    document.querySelectorAll('.character-display').forEach((img) => {
      img.style.opacity = '1'
      img.classList.remove('selected')
    })

    document.querySelectorAll('.select').forEach((selection) => {
      selection.style.opacity = '0'
    })

    elements.buttonConfirm.classList.remove('active')
    elements.confirmText.style.cursor = 'not-allowed'
  }

  elements.buttonRestart?.addEventListener('click', resetGame)
}

// emotions
function setupEmotions() {
  let emotionButtons = {
    love: document.querySelector('.love'),
    sadness: document.querySelector('.sadness'),
    blush: document.querySelector('.blush'),
    anger: document.querySelector('.anger'),
    surprise: document.querySelector('.surprise'),
    disgust: document.querySelector('.disgust')
  }

  Object.values(emotionButtons).forEach((button) => {
    if (button) {
      button.style.cursor = 'not-allowed'
    }
  })

  function resetAllEmotions() {
    let selectedCharacter = document.querySelector(
      '.characters3 .character-display.selected'
    )
    if (selectedCharacter) {
      let selectedCharacterName = selectedCharacter.dataset.character
      document
        .querySelectorAll('.characters3 .character-display')
        .forEach((img) => {
          img.style.opacity = '0'
        })
      selectedCharacter.style.opacity = '1'
    }

    resetEmotionImages()
    resetEmotionAnimations()
  }

  function resetEmotionImages() {
    let emotionImageSelectors = [
      '.sad-boy, .sad-girl, .sad-alien',
      '.angry-boy, .angry-girl, .angry-alien',
      '.surprised-boy, .surprised-girl, .surprised-alien',
      '.disgusted-boy, .disgusted-girl, .disgusted-alien'
    ]

    emotionImageSelectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((img) => {
        img.style.opacity = '0'
      })
    })
  }

  function resetEmotionAnimations() {
    let animationSelectors = [
      '.floating img, .teardrops img, .blushing img',
      '.left-boy, .right-boy, .left-girl, .right-girl',
      '.angry-dog, .curved-alien',
      '.surprise-boy, .surprise-girl, .surprise-dog, .surprise-alien',
      '.disgust-boy, .disgust-girl, .disgust-dog, .disgust-alien'
    ]

    animationSelectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((element) => {
        element.style.opacity = '0'
        element.style.animationPlayState = 'paused'
      })
    })

    document.querySelectorAll('.teardrops').forEach((container) => {
      container.style.opacity = '0'
      container.style.animationPlayState = 'paused'
    })
  }

  function activateEmotion(emotion, character) {
    resetAllEmotions()
    let characterName = character.dataset.character

    let emotionActions = {
      love: () => handleLoveEmotion(characterName),
      sadness: () => handleSadnessEmotion(characterName),
      blush: () => handleBlushEmotion(characterName),
      anger: () => handleAngerEmotion(characterName),
      surprise: () => handleSurpriseEmotion(characterName),
      disgust: () => handleDisgustEmotion(characterName)
    }

    if (emotionActions[emotion]) {
      emotionActions[emotion]()
    }
  }

  function handleLoveEmotion(characterName) {
    let emotionMap = {
      boy: 'floating-boy/alien',
      alien: 'floating-boy/alien',
      girl: 'floating-girl',
      dog: 'floating-dog'
    }
    let selectedEmotion = emotionMap[characterName]
    if (selectedEmotion) {
      document.querySelectorAll('.floating img').forEach((heart) => {
        if (heart.dataset.emotion === selectedEmotion) {
          heart.style.opacity = '1'
          heart.style.animationPlayState = 'running'
        }
      })
    }
  }

  function handleSadnessEmotion(characterName) {
    let emotionMap = {
      boy: 'crying-boy',
      girl: 'crying-girl',
      dog: 'crying-dog',
      alien: 'crying-alien'
    }
    let selectedEmotion = emotionMap[characterName]
    if (selectedEmotion) {
      document.querySelectorAll('.teardrops').forEach((container) => {
        container.style.opacity = '1'
        container.style.animationPlayState = 'running'
      })

      document.querySelectorAll('.teardrops img').forEach((tear) => {
        if (tear.dataset.emotion === selectedEmotion) {
          tear.style.opacity = '1'
          tear.style.animationPlayState = 'running'
        }
      })
    }

    let baseImage = document.querySelector(`.${characterName}`)
    let sadImage = document.querySelector(`.sad-${characterName}`)
    if (baseImage && sadImage) {
      baseImage.style.opacity = '0'
      sadImage.style.opacity = '1'
    }
  }

  function handleBlushEmotion(characterName) {
    let blushingElementsMap = {
      boy: ['.left1', '.left2', '.left3', '.right1', '.right2', '.right3'],
      girl: ['.left4', '.left5', '.left6', '.right4', '.right5', '.right6'],
      dog: ['.right7', '.right8', '.right9'],
      alien: ['.left7', '.left8', '.left9', '.right10', '.right11', '.right12']
    }
    let blushingElements = blushingElementsMap[characterName]
    if (blushingElements) {
      blushingElements.forEach((selector) => {
        let element = document.querySelector(selector)
        if (element) {
          element.style.opacity = '1'
          element.style.animationPlayState = 'running'
        }
      })
    }
  }

  function handleAngerEmotion(characterName) {
    let angerImagesMap = {
      boy: '.angry-boy',
      girl: '.angry-girl',
      alien: '.angry-alien'
    }
    let eyebrowElementsMap = {
      boy: ['.left-boy', '.right-boy'],
      girl: ['.left-girl', '.right-girl'],
      dog: ['.angry-dog'],
      alien: ['.curved-alien']
    }

    let angryImageSelector = angerImagesMap[characterName]
    if (angryImageSelector) {
      let angryImage = document.querySelector(angryImageSelector)
      if (angryImage) {
        angryImage.style.opacity = '1'
      }
    }

    let eyebrowElements = eyebrowElementsMap[characterName]
    if (eyebrowElements) {
      eyebrowElements.forEach((selector) => {
        let element = document.querySelector(selector)
        if (element) {
          element.style.opacity = '1'
          element.style.animationPlayState = 'running'
        }
      })
    }
  }

  function handleSurpriseEmotion(characterName) {
    let surpriseImagesMap = {
      boy: '.surprised-boy',
      girl: '.surprised-girl',
      alien: '.surprised-alien'
    }
    let surpriseElementsMap = {
      boy: '.surprise-boy',
      girl: '.surprise-girl',
      dog: '.surprise-dog',
      alien: '.surprise-alien'
    }

    let surprisedImageSelector = surpriseImagesMap[characterName]
    if (surprisedImageSelector) {
      let surprisedImage = document.querySelector(surprisedImageSelector)
      if (surprisedImage) {
        surprisedImage.style.opacity = '1'
      }
    }

    let surpriseElementSelector = surpriseElementsMap[characterName]
    if (surpriseElementSelector) {
      let surpriseElement = document.querySelector(surpriseElementSelector)
      if (surpriseElement) {
        surpriseElement.style.opacity = '1'
        surpriseElement.style.animationPlayState = 'running'
      }
    }
  }

  function handleDisgustEmotion(characterName) {
    let disgustImagesMap = {
      boy: '.disgusted-boy',
      girl: '.disgusted-girl',
      alien: '.disgusted-alien'
    }
    let disgustMouthElementsMap = {
      boy: '.disgust-boy',
      girl: '.disgust-girl',
      dog: '.disgust-dog',
      alien: '.disgust-alien'
    }

    let disgustedImageSelector = disgustImagesMap[characterName]
    if (disgustedImageSelector) {
      let disgustedImage = document.querySelector(disgustedImageSelector)
      if (disgustedImage) {
        disgustedImage.style.opacity = '1'
      }
    }

    let disgustMouthElementSelector = disgustMouthElementsMap[characterName]
    if (disgustMouthElementSelector) {
      let disgustMouthElement = document.querySelector(
        disgustMouthElementSelector
      )
      if (disgustMouthElement) {
        disgustMouthElement.style.opacity = '1'
        disgustMouthElement.style.animationPlayState = 'running'
      }
    }
  }

  Object.entries(emotionButtons).forEach(([emotion, button]) => {
    button.addEventListener('click', () => {
      let selectedCharacter = document.querySelector(
        '.characters3 .character-display.selected'
      )

      button.style.transform = 'scale(1.1)'
      setTimeout(() => {
        button.style.transform = 'scale(1)'
      }, 200)

      activateEmotion(emotion, selectedCharacter)
    })
  })

  resetAllEmotions()
}

// contenteditable text
function contenteditable() {
  let blankSpace = document.querySelector('.blank-space')
  let characters = document.querySelectorAll(
    '#choose-character .characters img'
  )
  let selectedCharacter = null

  blankSpace.setAttribute('contenteditable', 'false')
  blankSpace.style.cursor = 'not-allowed'
  console.log('Initial state: contenteditable is disabled.')

  function enableContenteditable() {
    blankSpace.setAttribute('contenteditable', 'true')
    blankSpace.style.cursor = 'text'
    console.log('contenteditable is now enabled after confirmation.')
  }

  window.enableContenteditable = enableContenteditable

  setupContenteditableCharacterSelection()
  setupTextInput()
  setupPasteHandler()
  setupEnterKeyHandler()

  function setupContenteditableCharacterSelection() {
    characters.forEach((character) => {
      console.log(
        `Adding click listener to character: ${character.dataset.character}`
      )

      character.addEventListener('click', () => {
        console.log(`Character clicked: ${character.dataset.character}`)
        document
          .querySelectorAll('#choose-character .characters img')
          .forEach((charachter) => charachter.classList.remove('selected'))
        character.classList.add('selected')
        selectedCharacter = character.dataset.character
        console.log(`Selected character: ${selectedCharacter}`)
      })
    })
  }

  function setupTextInput() {
    blankSpace.addEventListener('input', () => {
      let content = blankSpace.textContent.trim()
      if (content.length > 20) {
        blankSpace.textContent = content.slice(0, 20)
        alert('Достигнуто максимальное количество символов.')
      }
      placeCaretAtEnd(blankSpace)
    })

    blankSpace.addEventListener('click', () => placeCaretAtEnd(blankSpace))
  }

  function setupPasteHandler() {
    blankSpace.addEventListener('paste', (event) => {
      event.preventDefault()
      let pastedText = (event.clipboardData || window.clipboardData).getData(
        'text'
      )
      let currentText = blankSpace.textContent.trim()
      let newLength = currentText.length + pastedText.length

      if (newLength <= 20) {
        blankSpace.textContent += pastedText
      } else {
        alert('Достигнуто максимальное количество символов.')
      }
      placeCaretAtEnd(blankSpace)
    })
  }

  function setupEnterKeyHandler() {
    blankSpace.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') {
        event.preventDefault()
        console.log('"Enter" key pressed but suppressed.')
        blankSpace.blur()
        console.log('Focus removed from .blank-space.')
      }
    })
  }

  function placeCaretAtEnd(element) {
    if (
      typeof window.getSelection !== 'undefined' &&
      typeof document.createRange !== 'undefined'
    ) {
      let range = document.createRange()
      let selection = window.getSelection()
      range.selectNodeContents(element)
      range.collapse(false)
      selection.removeAllRanges()
      selection.addRange(range)
      element.focus()
    } else if (typeof document.body.createTextRange !== 'undefined') {
      let textRange = document.body.createTextRange()
      textRange.moveToElementText(element)
      textRange.collapse(false)
      textRange.select()
    }
  }
}

// choosing qualities
function chooseQualities() {
  let crosses = document.querySelectorAll(
    '.cross1, .cross2, .cross3, .cross4, .cross5, .cross6'
  )
  let characters = document.querySelectorAll(
    '#choose-character .characters img'
  )
  let selectedCharacter = null

  crosses.forEach((cross) => cross.classList.remove('enabled'))

  setupQualitiesCharacterSelection()
  setupCrossSelection()

  function setupQualitiesCharacterSelection() {
    characters.forEach((character) => {
      character.addEventListener('click', () => {
        characters.forEach((character) =>
          character.classList.remove('selected')
        )
        character.classList.add('selected')
        selectedCharacter = character.dataset.character
        console.log(`Selected character: ${selectedCharacter}`)
        crosses.forEach((cross) => cross.classList.add('enabled'))
      })
    })
  }

  function setupCrossSelection() {
    let crosses = document.querySelectorAll(
      '.cross1, .cross2, .cross3, .cross4, .cross5, .cross6'
    )

    crosses.forEach((cross) => {
      cross.addEventListener('click', () => {
        if (!cross.classList.contains('enabled')) {
          console.log('Cross not enabled:', cross.className)
          return
        }

        let visibleCrosses = Array.from(crosses).filter((c) =>
          c.classList.contains('visible')
        )
        let visibleCount = visibleCrosses.length
        console.log('Currently visible crosses:', visibleCount)

        if (cross.classList.contains('visible')) {
          cross.classList.remove('visible')
          console.log('Cross hidden:', cross.className)
          console.log('New visible count:', visibleCount - 1)
        } else {
          if (visibleCount < 3) {
            cross.classList.add('visible')
            console.log('Cross shown:', cross.className)
            console.log('New visible count:', visibleCount + 1)
          } else {
            console.log('Maximum qualities (3) already selected')
            alert('Вы можете выбрать только 3 качества.')
          }
        }
      })
    })
  }
}

// backgrounds
function backgrounds() {
  let buttons = document.querySelectorAll('.stripes, .polka-dot, .polygons')
  let backgrounds = document.querySelectorAll(
    '.back-stripes, .back-polka-dot, .back-polygons'
  )
  let characters = document.querySelectorAll(
    '#choose-character .characters img'
  )
  let isCharacterSelected = false

  buttons.forEach((button) => button.classList.remove('enabled'))

  setupBackgroundsCharacterSelection()
  setupBackgroundSelection()

  function setupBackgroundsCharacterSelection() {
    let characters = document.querySelectorAll(
      '#choose-character .characters img'
    )
    let buttons = document.querySelectorAll('.stripes, .polka-dot, .polygons')

    characters.forEach((character) => {
      character.addEventListener('click', () => {
        characters.forEach((character) =>
          character.classList.remove('selected')
        )
        character.classList.add('selected')
        isCharacterSelected = true
        console.log(`Selected character: ${character.dataset.character}`)
        buttons.forEach((button) => button.classList.add('enabled'))
      })
    })
  }

  function setupBackgroundSelection() {
    let buttons = document.querySelectorAll('.stripes, .polka-dot, .polygons')
    let backgrounds = document.querySelectorAll(
      '.back-stripes, .back-polka-dot, .back-polygons'
    )

    buttons.forEach((button, index) => {
      button.addEventListener('click', () => {
        if (!isCharacterSelected) {
          console.log('No character selected. Please select a character first.')
          return
        }

        console.log(`Button clicked: button${index + 1}`)
        backgrounds.forEach((background) =>
          background.classList.remove('visible')
        )
        backgrounds[index].classList.add('visible')
      })
    })
  }
}

// place order button
function placeOrder() {
  let placeOrderButton = document.querySelector('.button-place_order')
  let blankSpace = document.querySelector('.blank-space')
  let isCharacterSelected = false

  if (!placeOrderButton || !blankSpace) {
    console.error('Required elements not found for place order functionality')
    return
  }

  function detectLanguage(name) {
    let russianRegex = /[а-яА-Я]/
    return russianRegex.test(name) ? 'ru' : 'en'
  }

  function checkOrderRequirements() {
    let name = blankSpace.textContent.trim()
    let hasName = name.length > 0

    let allCrosses = document.querySelectorAll(
      '.cross1, .cross2, .cross3, .cross4, .cross5, .cross6'
    )
    let visibleCrosses = Array.from(allCrosses).filter((cross) =>
      cross.classList.contains('visible')
    )
    let selectedQualities = visibleCrosses.length
    let hasQualities = selectedQualities === 3

    let selectedBackground = document.querySelector(
      '.back-stripes.visible, .back-polka-dot.visible, .back-polygons.visible'
    )
    let hasBackground = !!selectedBackground

    console.log('Order requirements check:')
    console.log('- Name:', name)
    console.log('- Total crosses found:', allCrosses.length)
    console.log('- Visible crosses:', selectedQualities)
    console.log('- Has background:', hasBackground)

    let missingRequirements = []
    if (!hasName) missingRequirements.push('имя робота')
    if (!hasQualities) missingRequirements.push('3 качества')
    if (!hasBackground) missingRequirements.push('фон')

    return {
      isComplete: hasName && hasQualities && hasBackground,
      missingRequirements
    }
  }

  let confirmButton = document.querySelector('.button-confirm')
  confirmButton?.addEventListener('click', () => {
    let selectedCharacter = document.querySelector('.characters img.selected')
    if (!selectedCharacter) {
      return
    }
    isCharacterSelected = true
    placeOrderButton.classList.remove('disabled')
    placeOrderButton.classList.add('active')
    placeOrderButton.style.cursor = 'pointer'
  })

  placeOrderButton.addEventListener('click', () => {
    if (
      !isCharacterSelected ||
      placeOrderButton.classList.contains('disabled')
    ) {
      return
    }

    let { isComplete, missingRequirements } = checkOrderRequirements()

    if (!isComplete) {
      alert(
        `Для оформления заказа не забудьте указать: ${missingRequirements.join(
          ', '
        )}!`
      )
      return
    }

    let name = blankSpace.textContent.trim()
    let language = detectLanguage(name)
    let alertMessage =
      language === 'ru'
        ? `Спасибо за заказ! Ваш робот ${name} отправлен на сборку. Мы с вами свяжемся. С любовью, А.`
        : `Thank you for your order! Your robot ${name} has been sent for assembly. We will contact you soon. With love, A.`

    alert(alertMessage)
  })
}

// ADAPTIVES
// typewriter-adaptives
function typewriter_1024() {
  let typed = new Typed('#typewriter-1024', {
    strings: ['Hi!', 'Welcome!'],
    typeSpeed: 200,
    backSpeed: 100,
    backDelay: 1000,
    loop: true
  })
}

// drag lever
function drag_lever_1024() {
  let slider = createSlider(
    0,
    100,
    document.querySelector('.path-moving-1024'),
    document.querySelector('.lever-1024')
  )
  slider.setValue(100)

  function createSlider(min, max, element, thumb) {
    let slider = {
      min: 0,
      max: 100,
      value: min,
      element: document.querySelector('.path-moving-1024'),
      thumb: document.querySelector('.lever-1024')
    }

    let currentMoveHandler = null

    let handleMouseMove = (event) => {
      let pathRect = element.getBoundingClientRect()

      let y = event.clientY - pathRect.top

      let leverHeight = thumb.offsetHeight
      let maxY = pathRect.height - leverHeight + (4 * window.innerWidth) / 100
      let minY = -(leverHeight * 0.1)
      y = Math.max(minY, Math.min(maxY, y))

      thumb.style.top = `${(y * 100) / window.innerWidth}vw`

      thumb.style.left = '0.2vw'

      slider.value = max - ((y - minY) / (maxY - minY)) * (max - min)

      event.preventDefault()
    }

    let handleMouseUp = () => {
      if (currentMoveHandler) {
        document.removeEventListener('mousemove', currentMoveHandler)
        document.removeEventListener('mouseup', handleMouseUp)
        currentMoveHandler = null
      }
    }

    let handleMouseDown = (event) => {
      currentMoveHandler = handleMouseMove
      document.addEventListener('mousemove', currentMoveHandler)
      document.addEventListener('mouseup', handleMouseUp)
      event.preventDefault()
    }

    thumb.addEventListener('mousedown', handleMouseDown)

    slider.setValue = (value) => {
      value = Math.max(slider.min, Math.min(slider.max, value))
      let pathRect = element.getBoundingClientRect()
      let leverHeight = thumb.offsetHeight
      let maxY = pathRect.height - leverHeight + (4 * window.innerWidth) / 100
      let minY = -(leverHeight * 0.1)
      let y =
        ((slider.max - value) / (slider.max - slider.min)) * (maxY - minY) +
        minY

      thumb.style.top = `${(y * 100) / window.innerWidth}vw`

      thumb.style.left = '0.2vw'

      slider.value = value
    }

    slider.getValue = () => slider.value
    slider.getId = () => slider.element.id

    return slider
  }
}

function scroll_1024() {
  let buttonStart = document.querySelector('.button-start-1024')

  if (!buttonStart) return

  buttonStart.addEventListener('click', () => {
    let targetSection = document.getElementById('choose-character-1024')

    let headerHeight = -1700

    window.scrollTo({
      top: targetSection.offsetTop - headerHeight,
      behavior: 'smooth'
    })
  })
}
