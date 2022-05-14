function ActionRow(props){
    return(
        <tr>
            <td>{props.user}</td>
            <td>{props.action}</td>
            <td>{props.date}</td>
        </tr>
    )
}

export default ActionRow