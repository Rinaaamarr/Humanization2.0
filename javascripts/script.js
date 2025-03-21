document.addEventListener('DOMContentLoaded', () => {
  drag_lever()
  typewriter()
  scroll()
  synchronization()
  contenteditable()
  chooseQualities()
  backgrounds()
  placeOrder()
  setupEmotions()
})

let isCharacterConfirmed = false

// typewriter
function typewriter() {
  const typed = new Typed('#typewriter', {
    strings: ['Hi!', 'Welcome!'],
    typeSpeed: 200,
    backSpeed: 100,
    backDelay: 1000,
    loop: true,
    showCursor: true,
    cursorChar: '|'
  })
}

// drag-lever
function drag_lever() {
  const slider = createSlider(
    0,
    100,
    document.querySelector('.path-moving'),
    document.querySelector('.lever')
  )
  slider.setValue(100)
}

function createSlider(min, max, element, thumb) {
  const slider = {
    min: 0,
    max: 100,
    value: min,
    element: document.querySelector('.path-moving'),
    thumb: document.querySelector('.lever')
  }

  let currentMoveHandler = null

  const handleMouseMove = (evt) => {
    const pathRect = element.getBoundingClientRect()

    let y = evt.clientY - pathRect.top

    const leverHeight = thumb.offsetHeight
    const maxY = pathRect.height - leverHeight + (4 * window.innerWidth) / 100
    const minY = -(leverHeight * 0.67)
    y = Math.max(minY, Math.min(maxY, y))

    thumb.style.top = `${(y * 100) / window.innerWidth}vw`

    thumb.style.left = '2.4vw'

    slider.value = max - ((y - minY) / (maxY - minY)) * (max - min)

    evt.preventDefault()
  }

  const handleMouseUp = () => {
    if (currentMoveHandler) {
      document.removeEventListener('mousemove', currentMoveHandler)
      document.removeEventListener('mouseup', handleMouseUp)
      currentMoveHandler = null
    }
  }

  const handleMouseDown = (evt) => {
    currentMoveHandler = handleMouseMove
    document.addEventListener('mousemove', currentMoveHandler)
    document.addEventListener('mouseup', handleMouseUp)
    evt.preventDefault()
  }

  thumb.addEventListener('mousedown', handleMouseDown)

  slider.setValue = (value) => {
    value = Math.max(slider.min, Math.min(slider.max, value))
    const pathRect = element.getBoundingClientRect()
    const leverHeight = thumb.offsetHeight
    const maxY = pathRect.height - leverHeight + (4 * window.innerWidth) / 100
    const minY = -(leverHeight * 0.67)
    const y =
      ((slider.max - value) / (slider.max - slider.min)) * (maxY - minY) + minY

    thumb.style.top = `${(y * 100) / window.innerWidth}vw`

    thumb.style.left = '2.4vw'

    slider.value = value
  }

  slider.getValue = () => slider.value
  slider.getId = () => slider.element.id

  return slider
}

// scrolling
function scroll() {
  const buttonStart = document.querySelector('.button-start')

  if (!buttonStart) return

  buttonStart.addEventListener('click', () => {
    const targetSection = document.getElementById('choose-character')

    if (!targetSection) {
      console.error("Target section 'choose-character' not found!")
      return
    }

    const headerHeight = -830

    window.scrollTo({
      top: targetSection.offsetTop - headerHeight,
      behavior: 'smooth'
    })
  })
}

// choosing, synchronization, scan
function synchronization() {
  let currentlySelected = null
  let scanCount = 0

  let elements = {
    buttonConfirm: document.querySelector('.button-confirm'),
    confirmText: document.querySelector('.confirm'),
    buttonScan: document.querySelector('.button-scan'),
    buttonPlaceOrder: document.querySelector('.button-place_order'),
    buttonRestart: document.querySelector('.button-restart'),
    scanner: document.querySelector('.scanner')
  }

  Object.entries(elements).forEach(([key, element]) => {
    if (!element) console.error(`Missing element: ${key}`)
  })

  if (Object.values(elements).some((el) => !el)) {
    console.error('Required elements not found in the DOM!')
    return
  }

  function handleCharacterChange(newCharacter) {
    // Reset all states and animations
    document.querySelectorAll('.character-display').forEach((img) => {
      if (img.closest('#choose-character')) {
        img.style.opacity = '1'
      } else {
        const isSelected = img.dataset.character === newCharacter
        img.style.opacity = isSelected ? '1' : '0'
        img.classList.toggle('selected', isSelected)
      }
    })

    // Reset scan count
    scanCount = 0

    // Reset scanner position
    if (elements.scanner) {
      elements.scanner.classList.remove('scanning')
      elements.scanner.style.top = '14vw'
      elements.scanner.style.left = '50%'
      elements.scanner.style.transform = 'translateX(-50%)'
    }

    // Reset emotions
    document
      .querySelectorAll(
        '.floating img, .teardrops img, .blushing img, .left-boy, .right-boy, .left-girl, .right-girl, .angry-dog, .curved-alien, .surprise-boy, .surprise-girl, .surprise-dog, .surprise-alien, .disgust-boy, .disgust-girl, .disgust-dog, .disgust-alien'
      )
      .forEach((el) => {
        el.style.opacity = '0'
        el.style.animationPlayState = 'paused'
      })

    // Reset qualities
    document
      .querySelectorAll('.cross1, .cross2, .cross3, .cross4, .cross5, .cross6')
      .forEach((cross) => {
        cross.classList.remove('visible')
        cross.classList.remove('enabled')
      })

    // Reset backgrounds
    document
      .querySelectorAll('.back-stripes, .back-polka-dot, .back-polygons')
      .forEach((background) => {
        background.classList.remove('visible')
      })

    // Update the selected character in the emotions section
    let emotionsCharacter = document.querySelector(
      '.characters3 .character-display.selected'
    )
    if (emotionsCharacter) {
      emotionsCharacter.dataset.character = newCharacter
    }
  }

  function handleCharacterSelection() {
    if (isCharacterConfirmed) {
      alert(
        'К сожалению, вы не можете изменить персонажа после выбора. Вы можете обновить страницу, чтобы выбрать другого персонажа.'
      )
      return true
    }
    return false
  }

  function setupCharacter(characterClass, selectionClass) {
    let character = document.querySelector(`.${characterClass}`)
    let selection = document.querySelector(`.${selectionClass}`)

    if (!character || !selection) {
      console.error(
        `Element not found: .${characterClass} or .${selectionClass}`
      )
      return
    }

    character.addEventListener('click', () => {
      if (handleCharacterSelection()) return

      document
        .querySelectorAll('.select1, .select2, .select3, .select4')
        .forEach((select) => {
          select.style.opacity = '0'
        })

      selection.style.opacity = '1'

      document
        .querySelectorAll('.robo-girl, .robo-boy, .dog, .robo-alien')
        .forEach((char) => {
          char.classList.remove('selected')
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
      alert('Пожалуйста, выберите персонажа сначала!')
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
  }

  elements.scanner.addEventListener('animationend', () => {
    elements.scanner.classList.remove('scanning')

    if (scanCount === 1) {
      showBugs()
      alert(
        'Внимание! Были обнаружены неполадки в системе. Устрани их как можно скорее!'
      )
    } else if (scanCount === 2) {
      alert('Неполадки устранены! Можно двигаться дальше.')
      hideAllBugs()
      scanCount = 0
    }
  })

  function showBugs() {
    let selectedImage = document.querySelector('.characters img.selected')
    if (!selectedImage) {
      console.error('No selected image found in .characters')
      return
    }

    let selectedCharacter = selectedImage.dataset.character

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
      alert('Отлично! Попробуй просканировать персонажа снова.')
    }
  }

  function resetGame() {
    if (!elements.buttonRestart.classList.contains('active')) {
      return
    }

    window.location.replace(window.location.pathname)
  }

  function resetScannerPosition() {
    elements.scanner.style.top = '-7vw'
    elements.scanner.style.left = '50%'
    elements.scanner.style.transform = 'translateX(-50%)'
  }

  function resetScanCount() {
    scanCount = 0
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
  const emotionButtons = {
    love: document.querySelector('.love'),
    sadness: document.querySelector('.sadness'),
    blush: document.querySelector('.blush'),
    anger: document.querySelector('.anger'),
    surprise: document.querySelector('.surprise'),
    disgust: document.querySelector('.disgust')
  }

  // Add character change listener
  document
    .querySelectorAll('#choose-character .characters img')
    .forEach((character) => {
      character.addEventListener('click', () => {
        const newCharacter = character.dataset.character
        console.log('Character changed to:', newCharacter)

        // Reset all emotion states
        document
          .querySelectorAll(
            '.floating img, .teardrops img, .blushing img, .left-boy, .right-boy, .left-girl, .right-girl, .angry-dog, .curved-alien, .surprise-boy, .surprise-girl, .surprise-dog, .surprise-alien, .disgust-boy, .disgust-girl, .disgust-dog, .disgust-alien'
          )
          .forEach((el) => {
            el.style.opacity = '0'
            el.style.animationPlayState = 'paused'
          })

        // Update the selected character in the emotions section
        const emotionsCharacter = document.querySelector(
          '.characters3 .character-display.selected'
        )
        if (emotionsCharacter) {
          emotionsCharacter.dataset.character = newCharacter
        }
      })
    })

  function resetAllEmotions() {
    const selectedCharacter = document.querySelector(
      '.characters3 .character-display.selected'
    )
    if (selectedCharacter) {
      const selectedCharacterName = selectedCharacter.dataset.character
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
    const emotionImageSelectors = [
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
    const animationSelectors = [
      '.floating img, .teardrops img, .blushing img',
      '.left-boy, .right-boy, .left-girl, .right-girl',
      '.angry-dog, .curved-alien',
      '.surprise-boy, .surprise-girl, .surprise-dog, .surprise-alien',
      '.disgust-boy, .disgust-girl, .disgust-dog, .disgust-alien'
    ]

    animationSelectors.forEach((selector) => {
      document.querySelectorAll(selector).forEach((el) => {
        el.style.opacity = '0'
        el.style.animationPlayState = 'paused'
      })
    })

    document.querySelectorAll('.teardrops').forEach((container) => {
      container.style.opacity = '0'
      container.style.animationPlayState = 'paused'
    })
  }

  function activateEmotion(emotion, character) {
    resetAllEmotions()
    const characterName = character.dataset.character

    const emotionActions = {
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
    const emotionMap = {
      boy: 'floating-boy/alien',
      alien: 'floating-boy/alien',
      girl: 'floating-girl',
      dog: 'floating-dog'
    }
    const selectedEmotion = emotionMap[characterName]
    if (selectedEmotion) {
      document.querySelectorAll('.floating img').forEach((heart) => {
        if (heart.dataset.emotion === selectedEmotion) {
          heart.style.opacity = '1'
        }
      })
    }
  }

  function handleSadnessEmotion(characterName) {
    const emotionMap = {
      boy: 'crying-boy',
      girl: 'crying-girl',
      dog: 'crying-dog',
      alien: 'crying-alien'
    }
    const selectedEmotion = emotionMap[characterName]
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

    const baseImage = document.querySelector(`.${characterName}`)
    const sadImage = document.querySelector(`.sad-${characterName}`)
    if (baseImage && sadImage) {
      baseImage.style.opacity = '0'
      sadImage.style.opacity = '1'
    }
  }

  function handleBlushEmotion(characterName) {
    const blushingElementsMap = {
      boy: ['.left1', '.left2', '.left3', '.right1', '.right2', '.right3'],
      girl: ['.left4', '.left5', '.left6', '.right4', '.right5', '.right6'],
      dog: ['.right7', '.right8', '.right9'],
      alien: ['.left7', '.left8', '.left9', '.right10', '.right11', '.right12']
    }
    const blushingElements = blushingElementsMap[characterName]
    if (blushingElements) {
      blushingElements.forEach((selector) => {
        const element = document.querySelector(selector)
        if (element) {
          element.style.opacity = '1'
          element.style.animationPlayState = 'running'
        }
      })
    }
  }

  function handleAngerEmotion(characterName) {
    const angerImagesMap = {
      boy: '.angry-boy',
      girl: '.angry-girl',
      alien: '.angry-alien'
    }
    const eyebrowElementsMap = {
      boy: ['.left-boy', '.right-boy'],
      girl: ['.left-girl', '.right-girl'],
      dog: ['.angry-dog'],
      alien: ['.curved-alien']
    }

    const angryImageSelector = angerImagesMap[characterName]
    if (angryImageSelector) {
      const angryImage = document.querySelector(angryImageSelector)
      if (angryImage) {
        angryImage.style.opacity = '1'
      }
    }

    const eyebrowElements = eyebrowElementsMap[characterName]
    if (eyebrowElements) {
      eyebrowElements.forEach((selector) => {
        const element = document.querySelector(selector)
        if (element) {
          element.style.opacity = '1'
          element.style.animationPlayState = 'running'
        }
      })
    }
  }

  function handleSurpriseEmotion(characterName) {
    const surpriseImagesMap = {
      boy: '.surprised-boy',
      girl: '.surprised-girl',
      alien: '.surprised-alien'
    }
    const surpriseElementsMap = {
      boy: '.surprise-boy',
      girl: '.surprise-girl',
      dog: '.surprise-dog',
      alien: '.surprise-alien'
    }

    const surprisedImageSelector = surpriseImagesMap[characterName]
    if (surprisedImageSelector) {
      const surprisedImage = document.querySelector(surprisedImageSelector)
      if (surprisedImage) {
        surprisedImage.style.opacity = '1'
      }
    }

    const surpriseElementSelector = surpriseElementsMap[characterName]
    if (surpriseElementSelector) {
      const surpriseElement = document.querySelector(surpriseElementSelector)
      if (surpriseElement) {
        surpriseElement.style.opacity = '1'
        surpriseElement.style.animationPlayState = 'running'
      }
    }
  }

  function handleDisgustEmotion(characterName) {
    const disgustImagesMap = {
      boy: '.disgusted-boy',
      girl: '.disgusted-girl',
      alien: '.disgusted-alien'
    }
    const disgustMouthElementsMap = {
      boy: '.disgust-boy',
      girl: '.disgust-girl',
      dog: '.disgust-dog',
      alien: '.disgust-alien'
    }

    const disgustedImageSelector = disgustImagesMap[characterName]
    if (disgustedImageSelector) {
      const disgustedImage = document.querySelector(disgustedImageSelector)
      if (disgustedImage) {
        disgustedImage.style.opacity = '1'
      }
    }

    const disgustMouthElementSelector = disgustMouthElementsMap[characterName]
    if (disgustMouthElementSelector) {
      const disgustMouthElement = document.querySelector(
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
      const selectedCharacter = document.querySelector(
        '.characters3 .character-display.selected'
      )
      if (!selectedCharacter) {
        alert('Сначала выберите персонажа!')
        return
      }

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
  const blankSpace = document.querySelector('.blank-space')
  const characters = document.querySelectorAll(
    '#choose-character .characters img'
  )
  let selectedCharacter = null

  if (!blankSpace || characters.length === 0) {
    console.error(
      'Required elements not found for contenteditable functionality'
    )
    return
  }

  blankSpace.setAttribute('contenteditable', 'false')
  blankSpace.style.cursor = 'not-allowed'
  console.log('Initial state: contenteditable is disabled.')

  setupContenteditableCharacterSelection()
  setupTextInput()
  setupPasteHandler()
  setupEnterKeyHandler()
}

function setupContenteditableCharacterSelection() {
  const blankSpace = document.querySelector('.blank-space')
  const characters = document.querySelectorAll(
    '#choose-character .characters img'
  )

  characters.forEach((character) => {
    character.addEventListener('click', () => {
      if (handleCharacterSelection()) return

      document
        .querySelectorAll('#choose-character .characters img')
        .forEach((char) => char.classList.remove('selected'))
      character.classList.add('selected')
      selectedCharacter = character.dataset.character
      blankSpace.setAttribute('contenteditable', 'true')
      blankSpace.style.cursor = 'text'
    })
  })
}

function setupTextInput() {
  const blankSpace = document.querySelector('.blank-space')

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
  const blankSpace = document.querySelector('.blank-space')

  blankSpace.addEventListener('paste', (event) => {
    event.preventDefault()
    const pastedText = (event.clipboardData || window.clipboardData).getData(
      'text'
    )
    const currentText = blankSpace.textContent.trim()
    const newLength = currentText.length + pastedText.length

    if (newLength <= 20) {
      blankSpace.textContent += pastedText
    } else {
      alert('Достигнуто максимальное количество символов.')
    }
    placeCaretAtEnd(blankSpace)
  })
}

function setupEnterKeyHandler() {
  const blankSpace = document.querySelector('.blank-space')

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
    const range = document.createRange()
    const selection = window.getSelection()
    range.selectNodeContents(element)
    range.collapse(false)
    selection.removeAllRanges()
    selection.addRange(range)
    element.focus()
  } else if (typeof document.body.createTextRange !== 'undefined') {
    const textRange = document.body.createTextRange()
    textRange.moveToElementText(element)
    textRange.collapse(false)
    textRange.select()
  }
}

// choosing qualities
function chooseQualities() {
  const crosses = document.querySelectorAll(
    '.cross1, .cross2, .cross3, .cross4, .cross5, .cross6'
  )
  const characters = document.querySelectorAll(
    '#choose-character .characters img'
  )
  let selectedCharacter = null

  if (!crosses.length || !characters.length) {
    console.error('Required elements not found for qualities functionality')
    return
  }

  crosses.forEach((cross) => cross.classList.remove('enabled'))

  setupQualitiesCharacterSelection()
  setupCrossSelection()
}

function setupQualitiesCharacterSelection() {
  const characters = document.querySelectorAll(
    '#choose-character .characters img'
  )
  const crosses = document.querySelectorAll(
    '.cross1, .cross2, .cross3, .cross4, .cross5, .cross6'
  )

  characters.forEach((character) => {
    character.addEventListener('click', () => {
      if (handleCharacterSelection()) return

      characters.forEach((char) => char.classList.remove('selected'))
      character.classList.add('selected')
      selectedCharacter = character.dataset.character
      crosses.forEach((cross) => cross.classList.add('enabled'))
    })
  })
}

function setupCrossSelection() {
  const crosses = document.querySelectorAll(
    '.cross1, .cross2, .cross3, .cross4, .cross5, .cross6'
  )

  crosses.forEach((cross) => {
    cross.addEventListener('click', () => {
      if (!cross.classList.contains('enabled')) {
        console.log('Cross not enabled:', cross.className)
        return
      }

      const visibleCrosses = Array.from(crosses).filter((c) =>
        c.classList.contains('visible')
      )
      const visibleCount = visibleCrosses.length
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
          alert('Ты можешь выбрать только 3 качества.')
        }
      }
    })
  })
}

// backgrounds
function backgrounds() {
  const buttons = document.querySelectorAll('.stripes, .polka-dot, .polygons')
  const backgrounds = document.querySelectorAll(
    '.back-stripes, .back-polka-dot, .back-polygons'
  )
  const characters = document.querySelectorAll(
    '#choose-character .characters img'
  )
  let isCharacterSelected = false

  if (!buttons.length || !backgrounds.length || !characters.length) {
    console.error('Required elements not found for backgrounds functionality')
    return
  }

  buttons.forEach((button) => button.classList.remove('enabled'))

  setupBackgroundsCharacterSelection()
  setupBackgroundSelection()
}

function setupBackgroundsCharacterSelection() {
  const characters = document.querySelectorAll(
    '#choose-character .characters img'
  )
  const buttons = document.querySelectorAll('.stripes, .polka-dot, .polygons')

  characters.forEach((character) => {
    character.addEventListener('click', () => {
      if (handleCharacterSelection()) return

      characters.forEach((char) => char.classList.remove('selected'))
      character.classList.add('selected')
      isCharacterSelected = true
      buttons.forEach((button) => button.classList.add('enabled'))
    })
  })
}

function setupBackgroundSelection() {
  const buttons = document.querySelectorAll('.stripes, .polka-dot, .polygons')
  const backgrounds = document.querySelectorAll(
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

// place order button
function placeOrder() {
  const placeOrderButton = document.querySelector('.button-place_order')
  const blankSpace = document.querySelector('.blank-space')
  let isCharacterSelected = false

  if (!placeOrderButton || !blankSpace) {
    console.error('Required elements not found for place order functionality')
    return
  }

  function detectLanguage(name) {
    const russianRegex = /[а-яА-Я]/
    return russianRegex.test(name) ? 'ru' : 'en'
  }

  function checkOrderRequirements() {
    const name = blankSpace.textContent.trim()
    const hasName = name.length > 0

    const allCrosses = document.querySelectorAll(
      '.cross1, .cross2, .cross3, .cross4, .cross5, .cross6'
    )
    const visibleCrosses = Array.from(allCrosses).filter((cross) =>
      cross.classList.contains('visible')
    )
    const selectedQualities = visibleCrosses.length
    const hasQualities = selectedQualities === 3

    const selectedBackground = document.querySelector(
      '.back-stripes.visible, .back-polka-dot.visible, .back-polygons.visible'
    )
    const hasBackground = !!selectedBackground

    console.log('Order requirements check:')
    console.log('- Name:', name)
    console.log('- Total crosses found:', allCrosses.length)
    console.log('- Visible crosses:', selectedQualities)
    console.log('- Has background:', hasBackground)

    const missingRequirements = []
    if (!hasName) missingRequirements.push('имя робота')
    if (!hasQualities) missingRequirements.push('3 качества')
    if (!hasBackground) missingRequirements.push('фон')

    return {
      isComplete: hasName && hasQualities && hasBackground,
      missingRequirements
    }
  }

  const confirmButton = document.querySelector('.button-confirm')
  confirmButton?.addEventListener('click', () => {
    const selectedCharacter = document.querySelector('.characters img.selected')
    if (!selectedCharacter) {
      alert('Пожалуйста, выберите персонажа сначала!')
      return
    }

    isCharacterSelected = true
    placeOrderButton.classList.add('active')
    placeOrderButton.style.cursor = 'pointer'
  })

  placeOrderButton.addEventListener('click', () => {
    if (!isCharacterSelected) {
      alert('Пожалуйста, выберите персонажа сначала!')
      return
    }

    const { isComplete, missingRequirements } = checkOrderRequirements()

    if (!isComplete) {
      alert(
        `Для оформления заказа не забудьте указать: ${missingRequirements.join(
          ', '
        )}!`
      )
      return
    }

    const name = blankSpace.textContent.trim()
    const language = detectLanguage(name)
    const alertMessage =
      language === 'ru'
        ? `Спасибо за заказ! Ваш робот ${name} отправлен на сборку. Мы с вами свяжемся. С любовью, А.`
        : `Thank you for your order! Your robot ${name} has been sent for assembly. We will contact you soon. With love, A.`

    alert(alertMessage)
  })
}
