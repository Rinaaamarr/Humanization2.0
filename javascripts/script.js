// typewriter
document.addEventListener('DOMContentLoaded', () => {
  var typed = new Typed('#typewriter', {
    strings: ['Hi!', 'Welcome!'],
    typeSpeed: 200,
    backSpeed: 100,
    backDelay: 1000,
    loop: true,
    showCursor: true,
    cursorChar: '|'
  })
})

// drag-lever
document.addEventListener('DOMContentLoaded', () => {
  const lever = document.getElementById('lever')
  const pathMoving = document.getElementById('path-moving')
  const containerDrag = document.getElementById('container-drag')

  let isDragging = false
  let offsetY = 0 // Offset between mouse pointer and lever's top edge

  // Add event listeners for dragging
  lever.addEventListener('mousedown', (e) => {
    e.preventDefault() // Prevent default behavior
    isDragging = true

    // Calculate the initial offset between the mouse pointer and the lever's top edge
    const leverRect = lever.getBoundingClientRect()
    offsetY = e.clientY - leverRect.top

    // Debugging: Log initial offset
    console.log('Initial Offset:', offsetY)

    // Update the cursor style
    lever.style.cursor = 'grabbing'
  })

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return

    // Use requestAnimationFrame for smoother updates
    requestAnimationFrame(() => {
      // Get the bounding box of the container and path-moving
      const containerRect = containerDrag.getBoundingClientRect()
      const pathRect = pathMoving.getBoundingClientRect()

      // Calculate the new Y position of the lever relative to the container
      const newY = e.clientY - containerRect.top - offsetY

      // Constrain the lever's movement within the path-moving boundaries
      const leverHeight = lever.offsetHeight
      const minY = pathRect.top - containerRect.top // Top boundary of path-moving relative to container
      const maxY = pathRect.bottom - containerRect.top - leverHeight // Bottom boundary of path-moving relative to container

      // Clamp the lever's position within the boundaries
      const clampedY = Math.max(minY, Math.min(newY, maxY))

      // Update the lever's position
      lever.style.top = `${clampedY}px`

      // Debugging: Log positions
      console.log('New Y:', newY)
      console.log('Clamped Y:', clampedY)
      console.log('Lever Style Top:', lever.style.top)
    })
  })

  document.addEventListener('mouseup', () => {
    isDragging = false
    lever.style.cursor = 'grab'
  })
})

// scrolling
document.addEventListener('DOMContentLoaded', () => {
  const buttonStart = document.querySelector('.button-start')

  buttonStart.addEventListener('click', () => {
    const targetSection = document.getElementById('choose-character')

    if (targetSection) {
      const headerHeight = -830

      window.scrollTo({
        top: targetSection.offsetTop - headerHeight,
        behavior: 'smooth'
      })
    } else {
      console.error("Target section 'choose-character' not found!")
    }
  })
})

// choosing, synchronization, scan
document.addEventListener('DOMContentLoaded', () => {
  let currentlySelected = null
  let isCharacterConfirmed = false
  let scanCount = 0

  const buttonConfirm = document.querySelector('.button-confirm')
  const confirmText = document.querySelector('.confirm')
  const buttonScan = document.querySelector('.button-scan')
  const buttonPlaceOrder = document.querySelector('.button-place_order') // Corrected selector
  const buttonRestart = document.querySelector('.button-restart')
  const scanner = document.querySelector('.scanner')

  if (!buttonConfirm) console.error('Missing element: .button-confirm')
  if (!confirmText) console.error('Missing element: .confirm')
  if (!buttonScan) console.error('Missing element: .button-scan')
  if (!buttonPlaceOrder) console.error('Missing element: .button-place_order') // Corrected log
  if (!buttonRestart) console.error('Missing element: .button-restart')
  if (!scanner) console.error('Missing element: .scanner')

  if (
    !buttonConfirm ||
    !confirmText ||
    !buttonScan ||
    !buttonPlaceOrder ||
    !buttonRestart ||
    !scanner
  ) {
    console.error('Required elements not found in the DOM!')
    return
  }

  function setupCharacter(characterClass, selectionClass) {
    const character = document.querySelector(`.${characterClass}`)
    const selection = document.querySelector(`.${selectionClass}`)

    if (!character || !selection) {
      console.error(
        `Element not found: .${characterClass} or .${selectionClass}`
      )
      return
    }

    character.addEventListener('click', () => {
      if (currentlySelected && currentlySelected !== selection) {
        alert('Вы не можете выбрать двух персонажей одновременно.')
        return
      }

      if (selection.style.opacity === '1') {
        selection.style.opacity = '0'
        character.classList.remove('selected')
        currentlySelected = null
      } else {
        selection.style.opacity = '1'
        character.classList.add('selected')
        currentlySelected = selection
      }

      if (currentlySelected) {
        buttonConfirm.classList.add('active')
        confirmText.style.cursor = 'pointer'
      } else {
        buttonConfirm.classList.remove('active')
        confirmText.style.cursor = 'not-allowed'
      }
    })
  }

  setupCharacter('robo-girl', 'select1')
  setupCharacter('robo-boy', 'select2')
  setupCharacter('dog', 'select3')
  setupCharacter('robo-alien', 'select4')

  buttonConfirm.addEventListener('click', () => {
    if (!currentlySelected) {
      alert('Пожалуйста, выберите персонажа сначала!')
      return
    }

    const selectedClass = currentlySelected.classList[0]
    const characterMap = {
      select1: 'girl',
      select2: 'boy',
      select3: 'dog',
      select4: 'alien'
    }
    const selectedCharacterAttribute = characterMap[selectedClass]

    document.querySelectorAll('.character-display').forEach((img) => {
      if (img.closest('#choose-character')) {
        img.style.opacity = '1'
      } else {
        if (img.dataset.character === selectedCharacterAttribute) {
          img.style.opacity = '1'
          img.classList.add('selected')
        } else {
          img.style.opacity = '0'
          img.classList.remove('selected')
        }
      }
    })

    buttonScan.classList.add('active')
    buttonScan.style.cursor = 'pointer'
    buttonPlaceOrder.classList.add('active')
    buttonPlaceOrder.style.cursor = 'pointer'
    buttonRestart.classList.add('active')
    buttonRestart.style.cursor = 'pointer'

    isCharacterConfirmed = true

    const scanRobotSection = document.querySelector('.scan-robot')
    scanRobotSection.scrollIntoView({ behavior: 'smooth' })
  })

  document.body.addEventListener('click', (event) => {
    const buttonScan = event.target.closest('.button-scan.active')
    if (buttonScan && isCharacterConfirmed) {
      startScan()
    }
  })

  function startScan() {
    scanner.classList.add('scanning')
    scanCount++
    console.log('Scanning started!', `Scan Count: ${scanCount}`)
  }

  scanner.addEventListener('animationend', () => {
    console.log('Animation ended!')
    scanner.classList.remove('scanning')

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
    const selectedImage = document.querySelector('.characters img.selected')
    if (!selectedImage) {
      console.error('No selected image found in .characters')
      return
    }

    const selectedCharacter = selectedImage.dataset.character

    document.querySelectorAll('.bug').forEach((bug) => {
      if (bug.dataset.character === selectedCharacter) {
        bug.style.opacity = '1'
      } else if (
        bug.dataset.character === 'default' &&
        !document.querySelector(`.bug[data-character="${selectedCharacter}"]`)
      ) {
        bug.style.opacity = '1'
      } else {
        bug.style.opacity = '0'
      }
    })

    document.querySelectorAll('.bug').forEach((bug) => {
      bug.addEventListener('click', () => {
        bug.style.opacity = '0'
        checkAllBugsFixed()
      })
    })
  }

  function hideAllBugs() {
    document.querySelectorAll('.bug').forEach((bug) => {
      bug.style.opacity = '0'
    })
  }

  function checkAllBugsFixed() {
    const remainingBugs = Array.from(document.querySelectorAll('.bug')).filter(
      (bug) => bug.style.opacity === '1'
    )

    if (remainingBugs.length === 0) {
      alert('Отлично! Попробуй просканировать персонажа снова.')
    }
  }

  function resetGame() {
    hideAllBugs()

    scanner.style.top = '-7vw'
    scanner.style.left = '50%'
    scanner.style.transform = 'translateX(-50%)'

    scanCount = 0

    buttonScan.classList.add('active')
    buttonScan.style.cursor = 'pointer'

    buttonPlaceOrder.classList.remove('active')
    buttonPlaceOrder.style.cursor = 'not-allowed'
    buttonRestart.classList.remove('active')
    buttonRestart.style.cursor = 'not-allowed'

    currentlySelected = null
    isCharacterConfirmed = false

    document.querySelectorAll('.character-display').forEach((img) => {
      img.style.opacity = '1'
      img.classList.remove('selected')
    })

    document.querySelectorAll('.select').forEach((selection) => {
      selection.style.opacity = '0'
    })

    buttonConfirm.classList.remove('active')
    confirmText.style.cursor = 'not-allowed'
  }

  buttonRestart.addEventListener('click', () => {
    resetGame()
  })
})

// heart animation
document.addEventListener('DOMContentLoaded', () => {
  const hearts = document.querySelectorAll('.floating img')
  const loveEmoji = document.querySelector('.love')

  function showHearts(emotion) {
    hearts.forEach((heart) => {
      if (heart.dataset.emotion === emotion) {
        heart.style.opacity = '1'
      } else {
        heart.style.opacity = '0'
      }
    })
  }

  loveEmoji.addEventListener('click', () => {
    const selectedCharacter = document.querySelector(
      '.characters2 img.selected'
    )?.dataset.character

    const emotionMap = {
      boy: 'floating-boy/alien',
      alien: 'floating-boy/alien',
      girl: 'floating-girl',
      dog: 'floating-dog'
    }

    const selectedEmotion = emotionMap[selectedCharacter]

    if (selectedEmotion) {
      showHearts(selectedEmotion)
    } else {
      console.error('No character selected or invalid character!')
    }

    loveEmoji.style.transform = 'scale(1.1)'
    setTimeout(() => {
      loveEmoji.style.transform = 'scale(1)'
    }, 200)
  })

  hearts.forEach((heart) => {
    heart.style.opacity = '0'
  })
})

// teardrop animation
document.addEventListener('DOMContentLoaded', () => {
  const sadnessEmoji = document.querySelector('.sadness')
  const resetButton = document.querySelector('.button-restart')

  function showTears(emotion) {
    const tears = document.querySelectorAll('.teardrops img')
    tears.forEach((tear) => {
      if (tear.dataset.emotion === emotion) {
        tear.style.opacity = '1'
        tear.style.animationPlayState = 'running'
      } else {
        tear.style.opacity = '0'
        tear.style.animationPlayState = 'paused'
      }
    })
  }

  sadnessEmoji.addEventListener('click', () => {
    const selectedCharacter = document.querySelector(
      '.characters3 .character-display.selected'
    )
    if (!selectedCharacter) {
      console.error('No character selected!')
      return
    }

    const emotionMap = {
      boy: 'crying-boy',
      girl: 'crying-girl',
      dog: 'crying-dog',
      alien: 'crying-alien'
    }

    const selectedEmotion = emotionMap[selectedCharacter.dataset.character]

    showTears(selectedEmotion)

    switch (selectedCharacter.dataset.character) {
      case 'boy':
        document.querySelector('.boy').style.opacity = '0'
        document.querySelector('.sad-boy').style.opacity = '1'
        break

      case 'girl':
        document.querySelector('.girl').style.opacity = '0'
        document.querySelector('.sad-girl').style.opacity = '1'
        break

      case 'alien':
        document.querySelector('.alien').style.opacity = '0'
        document.querySelector('.sad-alien').style.opacity = '1'
        break

      case 'dog':
        break

      default:
        console.error('Invalid character selected!')
    }
  })

  resetButton?.addEventListener('click', () => {
    document.querySelector('.boy').style.opacity = '1'
    document.querySelector('.girl').style.opacity = '1'
    document.querySelector('.doggie').style.opacity = '1'
    document.querySelector('.alien').style.opacity = '1'

    document.querySelector('.sad-boy').style.opacity = '0'
    document.querySelector('.sad-girl').style.opacity = '0'
    document.querySelector('.sad-alien').style.opacity = '0'

    const tears = document.querySelectorAll('.teardrops img')
    tears.forEach((tear) => {
      tear.style.opacity = '0'
      tear.style.animationPlayState = 'paused'
    })
  })
})

// blush animation
document.addEventListener('DOMContentLoaded', () => {
  const blushEmoji = document.querySelector('.blush')
  const resetButton = document.querySelector('.button-restart')

  function activateBlushing(character) {
    const characterName = character.dataset.character

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

  blushEmoji.addEventListener('click', () => {
    const selectedCharacter = document.querySelector(
      '.characters2 img.selected'
    )
    if (!selectedCharacter) {
      alert('Сначала выберите персонажа!')
      return
    }

    activateBlushing(selectedCharacter)
  })

  resetButton?.addEventListener('click', () => {
    const allBlushingElements = document.querySelectorAll('.blushing img')
    allBlushingElements.forEach((element) => {
      element.style.opacity = '0'
      element.style.animationPlayState = 'paused'
    })
  })
})

// anger animation
document.addEventListener('DOMContentLoaded', () => {
  const angerButton = document.querySelector('.anger')
  const resetButton = document.querySelector('.button-restart')

  function activateAnger(character) {
    const characterName = character.dataset.character

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

  angerButton.addEventListener('click', () => {
    const selectedCharacter = document.querySelector(
      '.characters2 img.selected'
    )
    if (!selectedCharacter) {
      alert('Сначала выберите персонажа!')
      return
    }

    activateAnger(selectedCharacter)
  })

  resetButton?.addEventListener('click', () => {
    document
      .querySelectorAll('.angry-boy, .angry-girl, .angry-alien')
      .forEach((image) => {
        image.style.opacity = '0'
      })

    document
      .querySelectorAll(
        '.left-boy, .right-boy, .left-girl, .right-girl, .angry-dog, .curved-alien'
      )
      .forEach((element) => {
        element.style.opacity = '0'
        element.style.animationPlayState = 'paused'
      })
  })
})

// surprised animation
document.addEventListener('DOMContentLoaded', () => {
  const surpriseButton = document.querySelector('.surprise')
  const resetButton = document.querySelector('.button-restart')

  function activateSurprise(character) {
    const characterName = character.dataset.character

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

  surpriseButton.addEventListener('click', () => {
    const selectedCharacter = document.querySelector(
      '.characters2 img.selected'
    )
    if (!selectedCharacter) {
      alert('Сначала выберите персонажа!')
      return
    }

    activateSurprise(selectedCharacter)
  })

  resetButton?.addEventListener('click', () => {
    document
      .querySelectorAll('.surprised-boy, .surprised-girl, .surprised-alien')
      .forEach((image) => {
        image.style.opacity = '0'
      })

    document
      .querySelectorAll(
        '.surprise-boy, .surprise-girl, .surprise-dog, .surprise-alien'
      )
      .forEach((element) => {
        element.style.opacity = '0'
        element.style.animationPlayState = 'paused'
      })
  })
})

// disgust animation
document.addEventListener('DOMContentLoaded', () => {
  const disgustButton = document.querySelector('.disgust')
  const resetButton = document.querySelector('.button-restart')

  function activateDisgust(character) {
    const characterName = character.dataset.character

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

  disgustButton.addEventListener('click', () => {
    const selectedCharacter = document.querySelector(
      '.characters2 img.selected'
    )
    if (!selectedCharacter) {
      alert('Сначала выберите персонажа!')
      return
    }

    activateDisgust(selectedCharacter)
  })

  resetButton?.addEventListener('click', () => {
    document
      .querySelectorAll('.disgusted-boy, .disgusted-girl, .disgusted-alien')
      .forEach((image) => {
        image.style.opacity = '0'
      })

    document
      .querySelectorAll(
        '.disgust-boy, .disgust-girl, .disgust-dog, .disgust-alien'
      )
      .forEach((element) => {
        element.style.opacity = '0'
        element.style.animationPlayState = 'paused'
      })
  })
})
