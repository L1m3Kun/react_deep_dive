import { ChangeEvent, useEffect, useState, memo } from 'react'
import logo from './logo.svg';
import './App.css';

// function CopyrightComponent({ text }: {text:string} ) {
//   return <p>{text}</p>
// }

const CopyrightComponent = memo(function CopyrightComponent({
  text,
}: {
  text: string
}) {
  return <p>{text}</p>
})


function InputText({ onSubmit }: { onSubmit: (text: string) => void}) {
  const [text, setText] = useState('')
   
  function handleSubmit() {
      onSubmit(text)
  }

  function handleTextChange(e: ChangeEvent<HTMLInputElement>) {
      setText(e.target.value)
  }

  return (
    <>
      <input type='text' value={text} onChange={handleTextChange} />
      <button onClick={handleSubmit}>추가</button>
      <CopyrightComponent text='all rights reserved' />
    </>
  )
}

export default function App() {
    const [number, setNumber] = useState(0)
    const [list, setList] = useState([
        { name: 'apple', amount: '5000' },
        { name: 'orange', amount: '1000' },
        { name: 'watermelon', amount: '1500' },
        { name: 'pineapple', amount: '500' },
    ])

    // useEffect(() => {
    //     setTimeout(() => {
    //         console.log('surprise!')
    //         setText('1000')
    //     }, 3000)
    // })

    function onSubmit(text:string) {
      setList((prev) => [ ...prev, { name: text, amount: number.toString() }])
    }

    function handleNumberChange(e: ChangeEvent<HTMLInputElement>) {
        setNumber(e.target.valueAsNumber)
    }

    return (
        <div>
            <InputText onSubmit={onSubmit} />
            <input type="number" value={number} onChange={handleNumberChange} />

            <ul>
                {list.map((value, key) => (
                    <li key={key}>
                        {value.name} {value.amount}원
                    </li>

                ))}
            </ul>
        </div>
    )
} 