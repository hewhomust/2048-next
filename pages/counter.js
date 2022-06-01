import { motion } from "framer-motion"
import { useState } from "react"

const Counter = () => {
  const [x, setX] = useState(100)

  return (
    <div className="container grid pt-10 mx-auto place-items-center">
      <motion.button
        animate={{ x: x }}
        onClick={() => setX((prev) => prev + 100)}
        className="p-4 text-3xl font-bold text-white bg-blue-600"
      >
        Click Me
      </motion.button>
    </div>
  )
}

export default Counter
