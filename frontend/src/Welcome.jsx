const Welcome = (props) => {
    return (
        <div>
            <h1>welcome {props.name}</h1>
            <h1>country:{props.country}</h1>
        </div>
    )
}

export default Welcome