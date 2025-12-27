const tabs = document.querySelectorAll(".auth__tab")

tabs.forEach(tab => {
    tab.addEventListener("click" , () =>{
        tabs.forEach(t => t.classList.remove("auth__tab--active"));
        tab.classList.add("auth__tab--active")
    })
});


const inputs = document.querySelectorAll(".auth__input")
const usernameHint = document.querySelector(".auth__input-hint")
const items = document.querySelectorAll(".password-rules__item")
const submitBtn = document.querySelector(".auth__submit")
const successMsg = document.querySelector(".account__created")

let currentUsername = ""
let currentEmail = ""

const validators = {
  Username(value) {
    if (value.length < 3 || value.length > 15) {
      usernameHint.classList.add("auth__input-hint--active")
      return false
    }

    if (!/^[a-zA-Z0-9]+$/.test(value)) {
      usernameHint.classList.add("auth__input-hint--active")
      return false
    }

    usernameHint.classList.remove("auth__input-hint--active")
    currentUsername = value.toLowerCase()
    return true
  },

  Fullname(value) {
    if (!/^[a-zA-Z\s]+$/.test(value)) return false
    if (value.trim().split(" ").length < 2) return false
    return true
  },

  email(value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(value)) return false
    currentEmail = value.toLowerCase()
    return true
  },

  password(value) {
    const emailParts = currentEmail
      .split(/[@.]/)
      .filter(part => part.length > 2)

    const hasMinLength = value.length >= 8
    const hasNumberOrSymbol = /[0-9!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value)
    const hasUsername =
    currentUsername && value.toLowerCase().includes(currentUsername)
    const hasEmailPart = emailParts.some(part =>
      value.toLowerCase().includes(part)
    )

    items.forEach(item => {
      const textEl = item.querySelector(".password-rules__text")
      const svgPath = item.querySelector("svg path")
      const text = textEl.textContent.toLowerCase()

      let ok = false
      if (text.includes("at least 8 characters")) {
        ok = hasMinLength
      } else if (text.includes("cannot contain your name") || text.includes("email")) {
        ok = !hasUsername && !hasEmailPart
      } else if (text.includes("contains a number") || text.includes("symbol")) {
        ok = hasNumberOrSymbol
      } else if (text.includes("password strength")) {
        ok = hasMinLength && hasNumberOrSymbol && !hasUsername && !hasEmailPart
      }

      textEl.style.color = ok ? "#15803D" : "#DC2626"
      if (svgPath) {
        svgPath.setAttribute("stroke", ok ? "#15803D" : "#DC2626")
        svgPath.setAttribute("stroke-opacity", ok ? "1" : "0.25")
      }
    })

    return hasMinLength && hasNumberOrSymbol && !hasUsername && !hasEmailPart
  }

}

function updateSubmitState() {
  const isValid = [...inputs].every(input =>
    validators[input.id]?.(input.value)
  )

  submitBtn.disabled = !isValid

  if (isValid) {
    submitBtn.classList.add("auth__submit--active")
  } else {
    submitBtn.classList.remove("auth__submit--active")
  }
}

inputs.forEach(input => {
  input.addEventListener("input", () => {
    const isValid = validators[input.id]?.(input.value)
    input.style.borderColor = isValid ? "#15803D" : "#DC2626"
    updateSubmitState()
  })

  input.addEventListener("blur", () => {
    if (!input.value) {
      input.style.borderColor = "#DC2626"
    }
    updateSubmitState()
  })
})

submitBtn.addEventListener("click", e => {
  e.preventDefault()
  if (submitBtn.disabled) return


  inputs.forEach(input => {
    input.value = ""
    input.style.borderColor = ""
  })

  submitBtn.disabled = true
  submitBtn.classList.remove("auth__submit--active")

  successMsg.classList.add("account__created--active")


  items.forEach(item => {
    const textEl = item.querySelector(".password-rules__text")
    const svgPath = item.querySelector("svg path")

    if (textEl) textEl.style.color = "" 
    if (svgPath) {
      svgPath.setAttribute("stroke", "#465FF1") 
      svgPath.setAttribute("stroke-opacity", "0.25") 
    }
  })
})

