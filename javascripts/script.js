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

// choosing the character
// section synchronization
// scrolling to the scan
document.addEventListener('DOMContentLoaded', () => {
  let currentlySelected = null
  let isCharacterConfirmed = false
  let scanCount = 0 // Track the number of scans

  const buttonConfirm = document.querySelector('.button-confirm')
  const confirmText = document.querySelector('.confirm')
  const buttonScan = document.querySelector('.button-scan')
  const scanner = document.querySelector('.scanner')

  // Ensure required elements exist
  if (!buttonConfirm || !confirmText || !buttonScan || !scanner) {
    console.error('Required elements not found in the DOM!')
    return
  }

  // Function to set up character selection
  function setupCharacter(characterClass, selectionClass) {
    const character = document.querySelector(`.${characterClass}`)
    const selection = document.querySelector(`.${selectionClass}`)

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

  // Confirm button functionality
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

    // Update visibility of characters in all sections EXCEPT choose-character
    document.querySelectorAll('.character-display').forEach((img) => {
      if (img.closest('#choose-character')) {
        // Do NOT change opacity in the choose-character section
        img.style.opacity = '1' // Ensure all characters are visible
      } else {
        if (img.dataset.character === selectedCharacterAttribute) {
          img.style.opacity = '1'
          img.classList.add('selected') // Add 'selected' class

          // Dynamically position the scanner behind the selected character
          const scanPanel = document.querySelector('.scan-panel')
          const characterPosition = img.getBoundingClientRect()
          const panelPosition = scanPanel.getBoundingClientRect()

          // Calculate the scanner's position relative to the scan panel
          const scannerTop =
            characterPosition.top - panelPosition.top - scanner.offsetHeight / 2 // Adjust for scanner height
          const scannerLeft =
            characterPosition.left - panelPosition.left + img.offsetWidth / 2

          scanner.style.top = `${scannerTop}vw`
          scanner.style.left = `${scannerLeft}vw`
          scanner.style.transform = 'translateX(-50%)' // Center horizontally
        } else {
          img.style.opacity = '0'
          img.classList.remove('selected') // Remove 'selected' class
        }
      }
    })

    // Enable the scan button
    buttonScan.classList.add('active')
    buttonScan.style.cursor = 'pointer'
    isCharacterConfirmed = true

    const scanRobotSection = document.querySelector('.scan-robot')
    scanRobotSection.scrollIntoView({ behavior: 'smooth' })
  })

  // Event delegation for the button-scan
  document.body.addEventListener('click', (event) => {
    const buttonScan = event.target.closest('.button-scan.active')
    if (buttonScan && isCharacterConfirmed) {
      startScan()
    }
  })

  // Function to start the scanning animation
  function startScan() {
    scanner.classList.add('scanning') // Trigger the animation
    scanCount++ // Increment the scan count
    console.log('Scanning started!', `Scan Count: ${scanCount}`)
  }

  // Listen for the end of the scanning animation
  scanner.addEventListener('animationend', () => {
    console.log('Animation ended!')
    scanner.classList.remove('scanning') // Reset the animation

    if (scanCount === 1) {
      // Show bugs only after the first scan
      showBugs()
      alert(
        'Attention! There are bugs in the system! Fix them as fast as you can!'
      )
    } else if (scanCount === 2) {
      // After the second scan, remove bugs and show the clean character
      alert('Good job! The character is now bug-free.')
      hideAllBugs()
    } else if (scanCount === 3) {
      // After the third scan, allow restarting the game
      resetGame()
    }
  })

  // Function to show bugs based on selected character
  function showBugs() {
    const selectedImage = document.querySelector('.characters img.selected')
    if (!selectedImage) {
      console.error('No selected image found in .characters')
      return
    }

    const selectedCharacter = selectedImage.dataset.character

    // Show bugs based on the selected character
    document.querySelectorAll('.bug').forEach((bug) => {
      if (
        bug.dataset.character === selectedCharacter ||
        bug.dataset.character === 'default'
      ) {
        bug.style.opacity = '1'
      }
    })

    // Add click event listeners to bugs
    document.querySelectorAll('.bug').forEach((bug) => {
      bug.addEventListener('click', () => {
        bug.style.opacity = '0' // Hide the bug
        checkAllBugsFixed() // Check if all bugs are fixed
      })
    })
  }

  // Function to hide all bugs
  function hideAllBugs() {
    document.querySelectorAll('.bug').forEach((bug) => {
      bug.style.opacity = '0'
    })
  }

  // Function to check if all bugs are fixed
  function checkAllBugsFixed() {
    const remainingBugs = Array.from(document.querySelectorAll('.bug')).filter(
      (bug) => bug.style.opacity === '1'
    )

    if (remainingBugs.length === 0) {
      alert('Nice, try scanning again.')
      // Allow the user to scan again
    }
  }

  // Function to reset only specific parts of the game
  function resetGame() {
    // Reset bugs
    hideAllBugs()

    // Reset the scanner state
    scanner.style.top = '-7vw' // Reset scanner position
    scanner.style.left = '50%'
    scanner.style.transform = 'translateX(-50%)'

    // Reset variables
    scanCount = 0

    // Disable the scan button
    buttonScan.classList.remove('active')
    buttonScan.style.cursor = 'not-allowed'

    // Removed the scroll to the top
    // Removed the alert for game reset
  }
})
