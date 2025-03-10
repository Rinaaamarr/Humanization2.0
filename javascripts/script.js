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
  const path = document.querySelector('#path path') // Select the SVG path element
  const lever = document.getElementById('lever')

  if (!path) {
    console.error('Path element not found! Check your HTML structure.')
    return
  }

  let isDragging = false
  let mouseX = 0,
    mouseY = 0
  let offsetX = 0,
    offsetY = 0 // Track the initial offset

  // Create an SVG point for calculations
  const svgPoint = (x, y) => {
    const pt = path.ownerSVGElement.createSVGPoint()
    pt.x = x
    pt.y = y

    // Adjust for the path's CSS scaling and positioning
    const pathRect = path.getBoundingClientRect()
    pt.x -= pathRect.left
    pt.y -= pathRect.top

    const transformedPoint = pt.matrixTransform(path.getScreenCTM().inverse())
    console.log('Transformed Point:', transformedPoint) // Debugging
    return transformedPoint
  }

  // Function to constrain the lever's position
  const constrainLeverPosition = (mouseX, mouseY) => {
    // Transform the center of the lever to SVG coordinates
    const centerPoint = svgPoint(mouseX, mouseY)

    // Check if the center point is inside the path
    const isValidCenter =
      path.isPointInStroke(centerPoint) || path.isPointInFill(centerPoint)

    console.log('Validation Result (Center):', isValidCenter) // Debugging

    // Allow movement if the center is valid
    return isValidCenter
  }

  // Add event listeners for dragging
  lever.addEventListener('mousedown', (e) => {
    e.preventDefault() // Prevent default behavior (e.g., text selection)
    isDragging = true

    // Get the lever's bounding box for precise dimensions
    const leverRect = lever.getBoundingClientRect()

    // Calculate the initial offset between the mouse pointer and the lever's center
    offsetX = e.clientX - (leverRect.left + leverRect.width / 2)
    offsetY = e.clientY - (leverRect.top + leverRect.height / 2)

    // Update the cursor style
    lever.style.cursor = 'grabbing'
  })

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return

    // Update mouse position
    mouseX = e.clientX
    mouseY = e.clientY

    // Debugging: Log mouse position
    console.log('Mouse Position:', mouseX, mouseY)

    // Use requestAnimationFrame for smoother updates
    requestAnimationFrame(() => {
      // Validate the position
      if (constrainLeverPosition(mouseX, mouseY)) {
        // Calculate the lever's position using the initial offset
        const leverLeft = mouseX - lever.offsetWidth / 2 - offsetX
        const leverTop = mouseY - lever.offsetHeight / 2 - offsetY

        // Update the lever's position
        lever.style.left = `${leverLeft}px`
        lever.style.top = `${leverTop}px`

        // Debugging: Log lever position and offset
        console.log('Lever Position:', lever.style.left, lever.style.top)
        console.log('Offset:', offsetX, offsetY)
      } else {
        // Snap the lever back to the last valid position
        console.warn('Invalid position, snapping back!')
      }
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
      const headerHeight = -800

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
})
