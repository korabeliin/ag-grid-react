import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';

import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine-dark.css';
import {AgGridReact} from "ag-grid-react";
import { v4 as uuidv4 } from 'uuid';

const Grid = () => {

    const gridRef = useRef(); // Optional - for accessing Grid's API

    let data = [
        { make: 'Toyota', model: 'Celica', price: 35000},
        { make: 'Ford', model: 'Mondeo', price: 32000},
        { make: 'Porsche', model: 'Boxter', price: 72000},
        { make: 'BMW', model: 'X6', price: 35000},
        { make: 'Audi', model: 'Q5', price: 32000},
        { make: 'Tesla', model: 'Model X', price: 72000},
    ]

    const [cars, setCars] = useState([]); // Set rowData to Array of Objects, one Object per Row

    const [columnDefs] = useState([
        { field: 'make', editable: true, rowDrag: true},
        { field: 'model', editable: true},
        { field: 'price', editable: true}
    ]);

    useEffect(() => {
        data.forEach(function (data, index) {
            data.id = index;
        });
        setCars([...data])
    }, [])

    const addNewCar = useCallback((e) => {
        e.preventDefault();

        const newCar = {
            make: `${e.target.name.value}`,
            model: `${e.target.model.value}`,
            price: `${Math.floor(20000 + 50000 * Math.random())}`,
            id: uuidv4()
        }

        data.push(newCar)
        setCars(cars => [...cars, newCar])
        e.target.name.value = ''
        e.target.model.value = ''
    }, []);

    const getRowId = useCallback(params => {
        return params.data.id;
    })

    const onRemove = useCallback(() => {
        const selectedNodes = gridRef.current.api.getSelectedNodes();
        const selectedIds = selectedNodes.map(node => node.data.id);
        data = data.filter(el => selectedIds.indexOf(el.id) < 0);
        setCars([...data])
    }, []);

    // DefaultColDef sets props common to all Columns
    const defaultColDef = useMemo( ()=> ({
        sortable: true,
        filter: true
    }));

    // Example using Grid's API
    const buttonListener = useCallback( e => {
        gridRef.current.api.deselectAll();
    }, []);

    return (
        <div>
            {/* Example using Grid's API */}
            <div style={{display: 'flex', justifyContent: 'center'}}>
                <button onClick={buttonListener} >Deselect all</button>
                <form onSubmit={addNewCar}>
                    <input required type="text" name='name' placeholder="Car's name" />
                    <input required type="text" name='model' placeholder="Car's model" />
                    <button>Add a new car</button>
                </form>
                <button onClick={onRemove}>Remove selected</button>
            </div>

            {/* On div wrapping Grid a) specify theme CSS Class Class and b) sets Grid size */}
            <div className="ag-theme-alpine-dark" style={{width: 600, height: 500, margin: '20px auto'}}>

                <AgGridReact
                    getRowId={getRowId}
                    ref={gridRef} // Ref for accessing Grid's API
                    rowData={cars} // Row Data for Rows
                    columnDefs={columnDefs} // Column Defs for Columns
                    defaultColDef={defaultColDef} // Default Column Properties
                    rowDragManaged={true}
                    rowDragMultiRow={true}
                    rowSelection={'multiple'}
                    animateRows={true} // Optional - set to 'true' to have rows animate when sorted
                />
            </div>
        </div>
    );
};

export default Grid;