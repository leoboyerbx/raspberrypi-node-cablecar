import React from 'react'
import styled from 'styled-components'

const SwitchInput = styled.input`
&[type="checkbox"]{
    position: relative;
    width: 200px;
    height: 100px;
    -webkit-appearance: none;
    background: #c6c6c6;
    outline: none;
    border-radius: 100px;
    box-shadow: inset 0 0 5px rgba(0,0,0,.2);
    transition: .5s;
    }
    
    &:checked[type="checkbox"]{
    background: #03a9f4;
    }
    
    &[type="checkbox"]:before{
    content: "";
    position: absolute;
    width: 90px;
    height: 90px;
    border-radius: 100px;
    top: 5px;
    left: 5px;
    background: #fff;
    box-shadow: 0 2px 5px rgba(0,0,0,.2);
    transition: .5s;
    }
    
    &:checked[type="checkbox"]:before{
    left: 105px;
    }
`

const Switch = props => {

    return (
        <SwitchInput type="checkbox" {...props}></SwitchInput>
    )
}

export default Switch