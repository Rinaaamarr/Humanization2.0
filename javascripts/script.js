document.addEventListener('DOMContentLoaded', () => {
  drag_lever()
  typewriter()
  scroll()
  synchronization()
  //   heartAnimation()
  //   teardropAnimation()
  //   blushAnimation()
  //   angerAnimation()
  //   surprisedAnimation()
  //   disgustAnimation()
  contenteditable()
  chooseQualities()
  backgrounds()
  placeOrder()
  activateEmotion(emotion, character)
})

// typewriter
function typewriter() {
  var typed = new Typed('#typewriter', {
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
    thumb: document.querySelector('.lever'),
    shift: document.querySelector('.lever').offsetHeight / 2
  }

  const mouseDownCallback = (evt) => {
    let thumbYOffset = evt.clientY - thumb.offsetTop

    const mouseMoveCallback = (evt) => {
      let yRange = element.offsetHeight
      let y = Math.max(0, Math.min(yRange, evt.clientY - thumbYOffset))
      thumb.style.top = ((y - slider.shift) / window.innerWidth) * 100 + 'vw'
      slider.value = max - (y / yRange) * (max - min)
      evt.preventDefault()
    }

    const mouseUpCallback = (evt) => {
      document.removeEventListener('mousemove', mouseMoveCallback, false)
      document.removeEventListener('mouseup', mouseUpCallback, false)
    }

    document.addEventListener('mousemove', mouseMoveCallback, false)
    document.addEventListener('mouseup', mouseUpCallback, false)

    evt.preventDefault()
  }

  thumb.addEventListener('mousedown', mouseDownCallback, false)

  slider.setValue = function (value) {
    value = Math.max(slider.min, Math.min(slider.max, value))
    let yRange = slider.element.clientHeight
    let y = Math.floor(
      ((slider.max - value) / (slider.max - slider.min)) * yRange
    )
    slider.thumb.style.top =
      ((y - slider.shift) / window.innerWidth) * 100 + 'vw'
    slider.value = value
  }

  slider.getValue = function () {
    return slider.value
  }

  slider.getId = function () {
    return slider.element.id
  }

  return slider
}

// scrolling
function scroll() {
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
}

// choosing, synchronization, scan
function synchronization() {
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
}

// // heart animation
// function heartAnimation() {
//   const hearts = document.querySelectorAll('.floating img')
//   const loveEmoji = document.querySelector('.love')

//   function showHearts(emotion) {
//     hearts.forEach((heart) => {
//       if (heart.dataset.emotion === emotion) {
//         heart.style.opacity = '1'
//       } else {
//         heart.style.opacity = '0'
//       }
//     })
//   }

//   loveEmoji.addEventListener('click', () => {
//     const selectedCharacter = document.querySelector(
//       '.characters2 img.selected'
//     )?.dataset.character

//     const emotionMap = {
//       boy: 'floating-boy/alien',
//       alien: 'floating-boy/alien',
//       girl: 'floating-girl',
//       dog: 'floating-dog'
//     }

//     const selectedEmotion = emotionMap[selectedCharacter]

//     if (selectedEmotion) {
//       showHearts(selectedEmotion)
//     } else {
//       console.error('No character selected or invalid character!')
//     }

//     loveEmoji.style.transform = 'scale(1.1)'
//     setTimeout(() => {
//       loveEmoji.style.transform = 'scale(1)'
//     }, 200)
//   })

//   hearts.forEach((heart) => {
//     heart.style.opacity = '0'
//   })
// }

// // teardrop animation
// function teardropAnimation() {
//   const sadnessEmoji = document.querySelector('.sadness')
//   const resetButton = document.querySelector('.button-restart')

//   function showTears(emotion) {
//     const tears = document.querySelectorAll('.teardrops img')
//     tears.forEach((tear) => {
//       if (tear.dataset.emotion === emotion) {
//         tear.style.opacity = '1'
//         tear.style.animationPlayState = 'running'
//       } else {
//         tear.style.opacity = '0'
//         tear.style.animationPlayState = 'paused'
//       }
//     })
//   }

//   sadnessEmoji.addEventListener('click', () => {
//     const selectedCharacter = document.querySelector(
//       '.characters3 .character-display.selected'
//     )
//     if (!selectedCharacter) {
//       console.error('No character selected!')
//       return
//     }

//     const emotionMap = {
//       boy: 'crying-boy',
//       girl: 'crying-girl',
//       dog: 'crying-dog',
//       alien: 'crying-alien'
//     }

//     const selectedEmotion = emotionMap[selectedCharacter.dataset.character]

//     showTears(selectedEmotion)

//     switch (selectedCharacter.dataset.character) {
//       case 'boy':
//         document.querySelector('.boy').style.opacity = '0'
//         document.querySelector('.sad-boy').style.opacity = '1'
//         break

//       case 'girl':
//         document.querySelector('.girl').style.opacity = '0'
//         document.querySelector('.sad-girl').style.opacity = '1'
//         break

//       case 'alien':
//         document.querySelector('.alien').style.opacity = '0'
//         document.querySelector('.sad-alien').style.opacity = '1'
//         break

//       case 'dog':
//         break

//       default:
//         console.error('Invalid character selected!')
//     }
//   })
// }

// // blush animation
// function blushAnimation() {
//   const blushEmoji = document.querySelector('.blush')
//   const resetButton = document.querySelector('.button-restart')

//   function activateBlushing(character) {
//     const characterName = character.dataset.character

//     const blushingElementsMap = {
//       boy: ['.left1', '.left2', '.left3', '.right1', '.right2', '.right3'],
//       girl: ['.left4', '.left5', '.left6', '.right4', '.right5', '.right6'],
//       dog: ['.right7', '.right8', '.right9'],
//       alien: ['.left7', '.left8', '.left9', '.right10', '.right11', '.right12']
//     }

//     const blushingElements = blushingElementsMap[characterName]

//     if (blushingElements) {
//       blushingElements.forEach((selector) => {
//         const element = document.querySelector(selector)
//         if (element) {
//           element.style.opacity = '1'
//           element.style.animationPlayState = 'running'
//         }
//       })
//     }
//   }

//   blushEmoji.addEventListener('click', () => {
//     const selectedCharacter = document.querySelector(
//       '.characters2 img.selected'
//     )
//     if (!selectedCharacter) {
//       alert('Сначала выберите персонажа!')
//       return
//     }

//     activateBlushing(selectedCharacter)
//   })

//   resetButton?.addEventListener('click', () => {
//     const allBlushingElements = document.querySelectorAll('.blushing img')
//     allBlushingElements.forEach((element) => {
//       element.style.opacity = '0'
//       element.style.animationPlayState = 'paused'
//     })
//   })
// }

// // anger animation
// function angerAnimation() {
//   const angerButton = document.querySelector('.anger')
//   const resetButton = document.querySelector('.button-restart')

//   function activateAnger(character) {
//     const characterName = character.dataset.character

//     const angerImagesMap = {
//       boy: '.angry-boy',
//       girl: '.angry-girl',
//       alien: '.angry-alien'
//     }

//     const eyebrowElementsMap = {
//       boy: ['.left-boy', '.right-boy'],
//       girl: ['.left-girl', '.right-girl'],
//       dog: ['.angry-dog'],
//       alien: ['.curved-alien']
//     }

//     const angryImageSelector = angerImagesMap[characterName]
//     if (angryImageSelector) {
//       const angryImage = document.querySelector(angryImageSelector)
//       if (angryImage) {
//         angryImage.style.opacity = '1'
//       }
//     }

//     const eyebrowElements = eyebrowElementsMap[characterName]
//     if (eyebrowElements) {
//       eyebrowElements.forEach((selector) => {
//         const element = document.querySelector(selector)
//         if (element) {
//           element.style.opacity = '1'
//           element.style.animationPlayState = 'running'
//         }
//       })
//     }
//   }

//   angerButton.addEventListener('click', () => {
//     const selectedCharacter = document.querySelector(
//       '.characters2 img.selected'
//     )
//     if (!selectedCharacter) {
//       alert('Сначала выберите персонажа!')
//       return
//     }

//     activateAnger(selectedCharacter)
//   })
// }

// // surprised animation
// function surprisedAnimation() {
//   const surpriseButton = document.querySelector('.surprise')
//   const resetButton = document.querySelector('.button-restart')

//   function activateSurprise(character) {
//     const characterName = character.dataset.character

//     const surpriseImagesMap = {
//       boy: '.surprised-boy',
//       girl: '.surprised-girl',
//       alien: '.surprised-alien'
//     }

//     const surpriseElementsMap = {
//       boy: '.surprise-boy',
//       girl: '.surprise-girl',
//       dog: '.surprise-dog',
//       alien: '.surprise-alien'
//     }

//     const surprisedImageSelector = surpriseImagesMap[characterName]
//     if (surprisedImageSelector) {
//       const surprisedImage = document.querySelector(surprisedImageSelector)
//       if (surprisedImage) {
//         surprisedImage.style.opacity = '1'
//       }
//     }

//     const surpriseElementSelector = surpriseElementsMap[characterName]
//     if (surpriseElementSelector) {
//       const surpriseElement = document.querySelector(surpriseElementSelector)
//       if (surpriseElement) {
//         surpriseElement.style.opacity = '1'
//         surpriseElement.style.animationPlayState = 'running'
//       }
//     }
//   }

//   surpriseButton.addEventListener('click', () => {
//     const selectedCharacter = document.querySelector(
//       '.characters2 img.selected'
//     )
//     if (!selectedCharacter) {
//       alert('Сначала выберите персонажа!')
//       return
//     }

//     activateSurprise(selectedCharacter)
//   })
// }

// // disgust animation
// function disgustAnimation() {
//   const disgustButton = document.querySelector('.disgust')
//   const resetButton = document.querySelector('.button-restart')

//   function activateDisgust(character) {
//     const characterName = character.dataset.character

//     const disgustImagesMap = {
//       boy: '.disgusted-boy',
//       girl: '.disgusted-girl',
//       alien: '.disgusted-alien'
//     }

//     const disgustMouthElementsMap = {
//       boy: '.disgust-boy',
//       girl: '.disgust-girl',
//       dog: '.disgust-dog',
//       alien: '.disgust-alien'
//     }

//     const disgustedImageSelector = disgustImagesMap[characterName]
//     if (disgustedImageSelector) {
//       const disgustedImage = document.querySelector(disgustedImageSelector)
//       if (disgustedImage) {
//         disgustedImage.style.opacity = '1'
//       }
//     }

//     const disgustMouthElementSelector = disgustMouthElementsMap[characterName]
//     if (disgustMouthElementSelector) {
//       const disgustMouthElement = document.querySelector(
//         disgustMouthElementSelector
//       )
//       if (disgustMouthElement) {
//         disgustMouthElement.style.opacity = '1'
//         disgustMouthElement.style.animationPlayState = 'running'
//       }
//     }
//   }

//   disgustButton.addEventListener('click', () => {
//     const selectedCharacter = document.querySelector(
//       '.characters2 img.selected'
//     )
//     if (!selectedCharacter) {
//       alert('Сначала выберите персонажа!')
//       return
//     }

//     activateDisgust(selectedCharacter)
//   })
// }

// contenteditable text
function contenteditable() {
  const blankSpace = document.querySelector('.blank-space')
  const characters = document.querySelectorAll(
    '#choose-character .characters img'
  )
  let selectedCharacter = null

  blankSpace.setAttribute('contenteditable', 'false')
  console.log('Initial state: contenteditable is disabled.')

  if (characters.length === 0) {
    console.error(
      'No character elements found in #choose-character! Check your HTML structure.'
    )
    return
  }

  console.log(`Found ${characters.length} characters in #choose-character.`)

  characters.forEach((character) => {
    console.log(
      `Adding click listener to character: ${character.dataset.character}`
    )
    character.addEventListener('click', () => {
      console.log(`Character clicked: ${character.dataset.character}`)

      characters.forEach((char) => char.classList.remove('selected'))

      character.classList.add('selected')
      selectedCharacter = character.dataset.character

      blankSpace.setAttribute('contenteditable', 'true')
      console.log(`Selected character: ${selectedCharacter}`)
      console.log('contenteditable is now enabled.')

      if (window.getComputedStyle(blankSpace).cursor === 'not-allowed') {
        console.error('Cursor is still "not-allowed". Check CSS rules.')
      }
    })
  })

  blankSpace.addEventListener('input', () => {
    let content = blankSpace.textContent.trim()

    if (content.length > 20) {
      blankSpace.textContent = content.slice(0, 20)
      alert(`Достигнуто максимальное количество символов.`)
    }

    placeCaretAtEnd(blankSpace)
  })
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

  document.querySelector('.blank-space').addEventListener('click', function () {
    placeCaretAtEnd(this)
  })

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
      alert(`Достигнуто максимальное количество символов.`)
    }

    placeCaretAtEnd(blankSpace)
  })

  blankSpace.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      console.log('"Enter" key pressed but suppressed.')

      blankSpace.blur()
      console.log('Focus removed from .blank-space.')
    }
  })
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

  crosses.forEach((cross) => {
    cross.classList.remove('enabled')
  })

  characters.forEach((character) => {
    character.addEventListener('click', () => {
      characters.forEach((char) => char.classList.remove('selected'))

      character.classList.add('selected')
      selectedCharacter = character.dataset.character

      console.log(`Selected character: ${selectedCharacter}`)

      crosses.forEach((cross) => {
        cross.classList.add('enabled')
      })
    })
  })

  function countVisibleCrosses() {
    return Array.from(crosses).filter((cross) =>
      cross.classList.contains('visible')
    ).length
  }

  crosses.forEach((cross) => {
    cross.addEventListener('click', () => {
      if (!cross.classList.contains('enabled')) {
        console.log(`Cross not enabled: ${cross.className}`)
        return
      }

      console.log(`Cross clicked: ${cross.className}`)

      const visibleCount = countVisibleCrosses()

      if (cross.classList.contains('visible')) {
        cross.classList.remove('visible')
        console.log(`Cross hidden: ${cross.className}`)
      } else {
        if (visibleCount < 3) {
          cross.classList.add('visible')
          console.log(`Cross shown: ${cross.className}`)
        } else {
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

  buttons.forEach((button) => {
    button.classList.remove('enabled')
  })

  characters.forEach((character) => {
    character.addEventListener('click', () => {
      characters.forEach((char) => char.classList.remove('selected'))

      character.classList.add('selected')
      isCharacterSelected = true

      console.log(`Selected character: ${character.dataset.character}`)

      buttons.forEach((button) => {
        button.classList.add('enabled')
      })
    })
  })

  buttons.forEach((button, index) => {
    button.addEventListener('click', () => {
      if (!isCharacterSelected) {
        console.log('No character selected. Please select a character first.')
        return
      }

      console.log(`Button clicked: button${index + 1}`)

      backgrounds.forEach((background) => {
        background.classList.remove('visible')
      })

      const selectedBackground = backgrounds[index]
      selectedBackground.classList.add('visible')
    })
  })
}

// place order button
function placeOrder() {
  const placeOrderButton = document.querySelector('.button-place_order')
  const blankSpace = document.querySelector('.blank-space')
  let isCharacterSelected = false

  function detectLanguage(name) {
    const russianRegex = /[а-яА-Я]/
    return russianRegex.test(name) ? 'ru' : 'en'
  }

  const confirmButton = document.querySelector('.button-confirm')
  confirmButton.addEventListener('click', () => {
    const selectedCharacter = document.querySelector('.characters img.selected')
    if (!selectedCharacter) {
      alert('Пожалуйста, выберите персонажа сначала!')
      return
    }

    isCharacterSelected = true
    placeOrderButton.classList.add('active')

    console.log('Character confirmed. Button enabled.')
  })

  placeOrderButton.addEventListener('click', () => {
    if (
      !isCharacterSelected ||
      !placeOrderButton.classList.contains('active')
    ) {
      alert('Пожалуйста, выберите персонажа сначала!')
      return
    }

    const name = blankSpace.textContent.trim()

    if (!name) {
      alert('Please enter a robot name before placing an order.')
      return
    }

    const language = detectLanguage(name)

    let alertMessage
    if (language === 'ru') {
      alertMessage = `Спасибо за заказ! Ваш робот ${name} отправлен на сборку. Мы с вами свяжемся. С любовью, А.`
    } else {
      alertMessage = `Thank you for your order! Your robot ${name} has been sent for assembly. We will contact you soon. With love, A.`
    }

    alert(alertMessage)
  })
}

// const emotionButtons = {
//   love: document.querySelector('.love'),
//   sadness: document.querySelector('.sadness'),
//   blush: document.querySelector('.blush'),
//   anger: document.querySelector('.anger'),
//   surprise: document.querySelector('.surprise'),
//   disgust: document.querySelector('.disgust')
// }

// // Reset all emotions and character images
// function resetAllEmotions() {
//   // Reset character images
//   document.querySelectorAll('.boy, .girl, .doggie, .alien').forEach((img) => {
//     img.style.opacity = '1'
//   })
//   document
//     .querySelectorAll(
//       '.sad-boy, .sad-girl, .sad-alien, .angry-boy, .angry-girl, .angry-alien, .surprised-boy, .surprised-girl, .surprised-alien, .disgusted-boy, .disgusted-girl, .disgusted-alien'
//     )
//     .forEach((img) => {
//       img.style.opacity = '0'
//     })

//   // Reset all animations
//   document
//     .querySelectorAll(
//       '.floating img, .teardrops img, .blushing img, .left-boy, .right-boy, .left-girl, .right-girl, .angry-dog, .curved-alien, .surprise-boy, .surprise-girl, .surprise-dog, .surprise-alien, .disgust-boy, .disgust-girl, .disgust-dog, .disgust-alien'
//     )
//     .forEach((el) => {
//       el.style.opacity = '0'
//       el.style.animationPlayState = 'paused'
//     })
// }

// // Handle emotion activation
// function activateEmotion(emotion, character) {
//   // First reset all emotions
//   resetAllEmotions()

//   // Get the character name
//   const characterName = character.dataset.character

//   // Define emotion-specific actions
//   const emotionActions = {
//     love: () => {
//       const emotionMap = {
//         boy: 'floating-boy/alien',
//         alien: 'floating-boy/alien',
//         girl: 'floating-girl',
//         dog: 'floating-dog'
//       }
//       const selectedEmotion = emotionMap[characterName]
//       if (selectedEmotion) {
//         document.querySelectorAll('.floating img').forEach((heart) => {
//           if (heart.dataset.emotion === selectedEmotion) {
//             heart.style.opacity = '1'
//           }
//         })
//       }
//     },
//     sadness: () => {
//       const emotionMap = {
//         boy: 'crying-boy',
//         girl: 'crying-girl',
//         dog: 'crying-dog',
//         alien: 'crying-alien'
//       }
//       const selectedEmotion = emotionMap[characterName]
//       if (selectedEmotion) {
//         document.querySelectorAll('.teardrops img').forEach((tear) => {
//           if (tear.dataset.emotion === selectedEmotion) {
//             tear.style.opacity = '1'
//             tear.style.animationPlayState = 'running'
//           }
//         })
//       }
//       // Update character image
//       const baseImage = document.querySelector(`.${characterName}`)
//       const sadImage = document.querySelector(`.sad-${characterName}`)
//       if (baseImage && sadImage) {
//         baseImage.style.opacity = '0'
//         sadImage.style.opacity = '1'
//       }
//     },
//     blush: () => {
//       const blushingElementsMap = {
//         boy: ['.left1', '.left2', '.left3', '.right1', '.right2', '.right3'],
//         girl: ['.left4', '.left5', '.left6', '.right4', '.right5', '.right6'],
//         dog: ['.right7', '.right8', '.right9'],
//         alien: [
//           '.left7',
//           '.left8',
//           '.left9',
//           '.right10',
//           '.right11',
//           '.right12'
//         ]
//       }
//       const blushingElements = blushingElementsMap[characterName]
//       if (blushingElements) {
//         blushingElements.forEach((selector) => {
//           const element = document.querySelector(selector)
//           if (element) {
//             element.style.opacity = '1'
//             element.style.animationPlayState = 'running'
//           }
//         })
//       }
//     },
//     anger: () => {
//       const angerImagesMap = {
//         boy: '.angry-boy',
//         girl: '.angry-girl',
//         alien: '.angry-alien'
//       }
//       const eyebrowElementsMap = {
//         boy: ['.left-boy', '.right-boy'],
//         girl: ['.left-girl', '.right-girl'],
//         dog: ['.angry-dog'],
//         alien: ['.curved-alien']
//       }
//       // Update character image
//       const angryImageSelector = angerImagesMap[characterName]
//       if (angryImageSelector) {
//         const angryImage = document.querySelector(angryImageSelector)
//         if (angryImage) {
//           angryImage.style.opacity = '1'
//         }
//       }
//       // Update eyebrows
//       const eyebrowElements = eyebrowElementsMap[characterName]
//       if (eyebrowElements) {
//         eyebrowElements.forEach((selector) => {
//           const element = document.querySelector(selector)
//           if (element) {
//             element.style.opacity = '1'
//             element.style.animationPlayState = 'running'
//           }
//         })
//       }
//     },
//     surprise: () => {
//       const surpriseImagesMap = {
//         boy: '.surprised-boy',
//         girl: '.surprised-girl',
//         alien: '.surprised-alien'
//       }
//       const surpriseElementsMap = {
//         boy: '.surprise-boy',
//         girl: '.surprise-girl',
//         dog: '.surprise-dog',
//         alien: '.surprise-alien'
//       }
//       // Update character image
//       const surprisedImageSelector = surpriseImagesMap[characterName]
//       if (surprisedImageSelector) {
//         const surprisedImage = document.querySelector(surprisedImageSelector)
//         if (surprisedImage) {
//           surprisedImage.style.opacity = '1'
//         }
//       }
//       // Update surprise elements
//       const surpriseElementSelector = surpriseElementsMap[characterName]
//       if (surpriseElementSelector) {
//         const surpriseElement = document.querySelector(surpriseElementSelector)
//         if (surpriseElement) {
//           surpriseElement.style.opacity = '1'
//           surpriseElement.style.animationPlayState = 'running'
//         }
//       }
//     },
//     disgust: () => {
//       const disgustImagesMap = {
//         boy: '.disgusted-boy',
//         girl: '.disgusted-girl',
//         alien: '.disgusted-alien'
//       }
//       const disgustMouthElementsMap = {
//         boy: '.disgust-boy',
//         girl: '.disgust-girl',
//         dog: '.disgust-dog',
//         alien: '.disgust-alien'
//       }
//       // Update character image
//       const disgustedImageSelector = disgustImagesMap[characterName]
//       if (disgustedImageSelector) {
//         const disgustedImage = document.querySelector(disgustedImageSelector)
//         if (disgustedImage) {
//           disgustedImage.style.opacity = '1'
//         }
//       }
//       // Update mouth elements
//       const disgustMouthElementSelector = disgustMouthElementsMap[characterName]
//       if (disgustMouthElementSelector) {
//         const disgustMouthElement = document.querySelector(
//           disgustMouthElementSelector
//         )
//         if (disgustMouthElement) {
//           disgustMouthElement.style.opacity = '1'
//           disgustMouthElement.style.animationPlayState = 'running'
//         }
//       }
//     }
//   }

//   // Execute the emotion-specific action
//   if (emotionActions[emotion]) {
//     emotionActions[emotion]()
//   }
// }

// // Add click handlers for each emotion button
// Object.entries(emotionButtons).forEach(([emotion, button]) => {
//   button.addEventListener('click', () => {
//     const selectedCharacter = document.querySelector(
//       '.characters2 img.selected'
//     )
//     if (!selectedCharacter) {
//       alert('Сначала выберите персонажа!')
//       return
//     }

//     // Add button animation
//     button.style.transform = 'scale(1.1)'
//     setTimeout(() => {
//       button.style.transform = 'scale(1)'
//     }, 200)

//     activateEmotion(emotion, selectedCharacter)
//   })
// })

// // Reset button handler
// resetButton?.addEventListener('click', resetAllEmotions)

// // Initial reset
// resetAllEmotions()
