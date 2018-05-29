import React from 'react';
import './Tile.css'

const Tile = (props) => {
	return (
		<input 
			className="Tile"
			type="number"  
			value={props.value} 
			id={props.id} 
			onChange={(e) => props.onChange(e.target.value, e.target.id)}
			disabled={props.initialBoard[props.id]} 
		/>
	)
}

export default Tile;