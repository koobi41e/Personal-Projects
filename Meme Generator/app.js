document.addEventListener("DOMContentLoaded", function (){ 
    const submitBtn = document.querySelector("#submitBtn")
    const imageInput = document.querySelector("#imageInput")
    const topText = document.querySelector("#topTextInput")
    const bottomText = document.querySelector("#bottomTextInput")
    const body = document.querySelector('body')

    
    function createNewDiv(id,className){
        let tempId = id
        let tempClassName = className
        let newDiv = document.createElement("div")
        newDiv.setAttribute('class',tempClassName)
        newDiv.setAttribute('id',tempId)
        return newDiv 
    }
    function createNewImg(id,className,url){
        let tempId = id
        let tempClassName = className
        let newImg = document.createElement("img")
        newImg.setAttribute('class',tempClassName)
        newImg.setAttribute('id',tempId)
        newImg.setAttribute('src',url)
        return newImg
    }
    function createNewText(id,className,flag){
        let tempId = id
        let tempClassName = className
        let newTxt = document.createElement("p")
        newTxt.setAttribute('class',tempClassName)
        newTxt.setAttribute('id',tempId)
        if(flag === "l"){ newTxt.innerText = bottomText.value
        }else{ newTxt.innerText = topText.value}
        return newTxt
    }

    function createMeme(id,className){
        let div= createNewDiv(`div_${id}`, `${className}`)
        let img= createNewImg(`img_${id}`, `${className}`,imageInput.value)
        let upperText = createNewText(`uTxt_${id}`, `${className}`,"u")
        let lowerText = createNewText(`lTxt_${id}`, `${className}`,"l")
        let deleteBtn = document.createElement('button')
        deleteBtn.innerText = 'Delete'
        deleteBtn.addEventListener('click', function (){
            div.remove()    
        })
        div.append(upperText)
        div.append(img)
        div.append(lowerText)
        div.append(deleteBtn)
        return div  
    }
    
    
    submitBtn.addEventListener("click", function (event){
        event.preventDefault()
        console.log(event)
        console.log(imageInput)
        console.log(topText)
        console.log(bottomText)

        let meme1 = createMeme("testId","testClass")
        body.appendChild(meme1)
        imageInput.value=''
        topText.value=''
        bottomText.value=''
    })
})