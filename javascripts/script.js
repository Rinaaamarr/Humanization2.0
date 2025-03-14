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
        'Attention! There are bugs in the system! Fix them as fast as you can!'
      )
    } else if (scanCount === 2) {
      alert('Good job! The character is now bug-free.')
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
      alert('Nice, try scanning again.')
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
