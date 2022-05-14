function LogFileRow(props){
    return(
        <tr>
            <td>{props.filename}</td>
            <td>{props.upload}</td>
        </tr>
    )
}

export default LogFileRow