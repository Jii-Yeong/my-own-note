import React from "react";
import styled, { css } from "styled-components";

const Wrapper = styled.button<{object: any}>`
  border: 1px solid #6667ab;
  color: #ffffff;
  background-color: #6667ab;
  ${({object}) => object && css`font-size: ${object.fontSize ?? 15}px;`}
  ${({object}) => object && css`width: ${object.width}px;`}
  ${({object}) => object && css`height: ${object.height}px;`}
  ${({object}) => object && css`border-radius: ${object.borderRadius}px;`}
  ${({object}) => object && css`position: ${object.position};`}
  ${({object}) => object && css`top: ${object.top}%;`}
  ${({object}) => object && css`left: ${object.left}%;`}
  font-family: 'nanum';
  cursor: pointer;
  margin: 15px 20px 0px 8px;
  &:hover {
    background-color: #6667ab;
    color: #ffffff;
  }
`

type Props = {
  name: string;
  buttonClick: () => void;
  cssObject: {[key: string]: any};
  buttonType: 'button' | 'submit' | 'reset' | undefined;
}


const Button = ({ name, buttonClick, cssObject, buttonType }: Props) => {
  console.log("cssObject", buttonType);
  return (
    <Wrapper onClick={() => buttonClick()} object={cssObject} type={buttonType ?? 'button'}>
      {name}
    </Wrapper>
  )
}

export default Button;