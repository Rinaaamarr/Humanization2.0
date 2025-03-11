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

    // Debugging: Log end of drag
    console.log('Drag ended')
  })

  // Prevent accidental dragging when clicking outside the lever
  document.addEventListener('dragstart', (e) => {
    e.preventDefault()
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

  const buttonConfirm = document.querySelector('.button-confirm')
  const confirmText = document.querySelector('.confirm')

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
        currentlySelected = null
      } else {
        selection.style.opacity = '1'
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

    document
      .querySelectorAll(
        '.characters2 img[data-character], .characters3 img[data-character], .characters4 img[data-character]'
      )
      .forEach((img) => {
        if (img.dataset.character === selectedCharacterAttribute) {
          img.style.opacity = '1'
          console.log('Setting opacity to 1 for:', img)
        } else {
          img.style.opacity = '0'
          console.log('Setting opacity to 0 for:', img)
        }
      })

    document.querySelector('.button-scan').classList.add('active')
    document.querySelector('.button-place_order').classList.add('active')
    document.querySelector('.button-restart').classList.add('active')

    const scanRobotSection = document.querySelector('.scan-robot')
    scanRobotSection.scrollIntoView({ behavior: 'smooth' })
  })
})
