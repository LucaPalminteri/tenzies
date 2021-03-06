import React, {useState, useEffect} from "react"
import Die from "./Die"
import {nanoid} from "nanoid"
import Confetti from 'react-confetti'
import './/style.css'

export default function App() {

    const [dice, setDice] = useState(allNewDice())
    const [tenzies, setTenzies] = useState(false)
    const [count,setCount] = useState(0)
    const [record,setRecord] = useState(0)

    
    useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)

        
        if (allHeld && !allSameValue) alert(`Warning: All numbers must be equal`);
        if (allHeld && allSameValue) {
            
            if (record === 0) {
                setRecord(count)
                localStorage.setItem('record', count);
            }
            else {
                if (count < record) {
                    alert('Congrats, new record!');
                    setRecord(count);
                    localStorage.setItem('record', count);
                }
            }
            setTenzies(true)
        }
    }, [dice])

    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }
    
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 12; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }
    
    function rollDice() {
        setCount(count+1)
        if(!tenzies) {
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? 
                    die :
                    generateNewDie()
            }))
        } else {
            
            setCount(0)
            setTenzies(false)
            setDice(allNewDice())
        }
    }
    
    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
                {...die, isHeld: !die.isHeld} :
                die
        }))
    }
    
    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            holdDice={() => holdDice(die.id)}
        />
    ))
    
    return (
        <main>
            {tenzies && <Confetti width={window.innerWidth} height={window.innerHeight - 5}/>}
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. 
            Click each die to freeze it at its current value between rolls.</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <div>
                <span><strong>ROLLS:</strong> {count}</span>
                <span><strong>RECORD:</strong> {localStorage.getItem('record')}</span>
            </div>
            <button 
                className="roll-dice" 
                onClick={rollDice}
            >
                {tenzies ? "New Game" : "Roll"}
            </button>
        </main>
    )
}