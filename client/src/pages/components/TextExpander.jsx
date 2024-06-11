import { useState } from "react";

export default function TextExpander({
    children,
    collapsedNumWords = 10,
    expandButtonText = "Show more",
    collapseButtonText = "Show less",
    buttonColor = "green",
  }) {
    const [expanded, setExpanded] = useState(false);
    // const collapsedText = { children };
    const childText = children.toString().split(" ");
  
    // Truncate the text to the specified number of words
    const finalText = childText.slice(0, collapsedNumWords).join(" ") + "...";
  
    console.log(finalText);
    return (
      <div className="box">
        {expanded ? (
          <OPenText
            collapseButtonText={collapseButtonText}
            buttonColor={buttonColor}
            onExpand={() => setExpanded(!expanded)}
          >
            {children}
          </OPenText>
        ) : (
          <CloseText
            buttonColor={buttonColor}
            onExpand={() => setExpanded(!expanded)}
            expandButtonText={expandButtonText}
          >
            {finalText}
          </CloseText>
        )}
      </div>
    );
  }
  
  function OPenText({ children, buttonColor, collapseButtonText, onExpand }) {
    return (
      <div className="box">
        {children}
        <button style={{ color: buttonColor }} onClick={onExpand}>
          {collapseButtonText}
        </button>
      </div>
    );
  }
  
  function CloseText({ children, buttonColor, expandButtonText, onExpand }) {
    return (
      <div className="box">
        {children}
        <button style={{ color: buttonColor }} onClick={onExpand}>
          {expandButtonText}
        </button>
      </div>
    );
  }
  