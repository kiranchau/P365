import { useState } from "react"

export default function UseMultistepForm(steps) {
  const [currentStepIndex, setCurrentStepIndex] = useState(0)

  // Function to navigate to the next step in a multi-step process
  function next() {
    setCurrentStepIndex(i => {
      // Check if the current step index is already at the last step
      if (i >= steps.length - 1) return i // If at the last step, do nothing
      return i + 1  // Increment the current step index to move to the next step
    })
  }

  // Function to navigate back to the previous step by updating the current step index
  function back() {
    setCurrentStepIndex(i => {
      // Ensure that the index doesn't go below 0
      if (i <= 0) return i
      // Decrement the current step index
      return i - 1
    })
  }

  // Function to navigate to a specific step by updating the current step index
  function goTo(index) {
    setCurrentStepIndex(index)
  }

  return {
    currentStepIndex,
    step: steps[currentStepIndex],
    steps,
    isFirstStep: currentStepIndex === 0,
    isSecondStep: currentStepIndex === 1,
    isLastStep: currentStepIndex === steps.length - 1,
    goTo,
    next,
    back,
  }
}
