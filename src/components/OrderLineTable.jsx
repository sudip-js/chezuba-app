import React, { useEffect, useState } from 'react'
import { fetchOrderLines } from '../services/apis/actions'


const OrderLineTable = () => {
    const [data, setData] = useState([])
    const [isLoading, setIsLoading] = useState(false)
    const [quantity, setQuantity] = useState('');
    const [typeID, setTypeID] = useState('');

    const handleFetchOrderLines = async () => {
        setIsLoading(true)
        try {
            const params = `type_id=${typeID || '1'}&quantity=${quantity || '1'}`
            const response = await fetchOrderLines(params);
            if (response?.status === 200) {
                setData(response?.data)
            }
        } catch (error) {
            console.error({ error })
        } finally {
            setIsLoading(false)
        }
    }

    const groupOrderLinesByOrderID = (orderLines) => {
        const groupedData = {};
        orderLines.forEach((orderLine) => {
            const { OrderID } = orderLine;
            if (!groupedData[OrderID]) {
                groupedData[OrderID] = [];
            }
            groupedData[OrderID].push(orderLine);
        });
        return groupedData;
    };

    const groupedData = groupOrderLinesByOrderID(data);

    useEffect(() => {
        handleFetchOrderLines()
    }, [])

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            handleFetchOrderLines()
        }, 700);
        return () => clearTimeout(debounceTimer);
    }, [quantity, typeID]);


    return (
        <section className='container my-5'>
            <div class="alert alert-danger d-flex align-items-center gap-2 justify-content-between" role="alert" >
                <div> Order Lines</div>
                <form class="d-flex" role="search">
                    <input className="form-control me-2" type="number" placeholder="Enter Type ID" aria-label="Select" value={typeID} onChange={(e) => setTypeID(e.target.value)} />
                    <input className="form-control me-2" type="number" placeholder="Filter Quantity" aria-label="Filter" value={quantity} onChange={(e) => setQuantity(e.target.value)} />
                </form>
            </div>
            {isLoading && <p className='text-center'>Please wait...</p>}
            {!isLoading && data.length === 0 && <p className='text-center'>No Records Found!</p>}
            {Object.keys(groupedData).map((orderID) => (
                <div key={orderID}>
                    <div class="alert alert-dark" role="alert">
                        <h6>Order ID: {orderID}</h6>
                    </div>
                    <table className="table">
                        <thead>
                            <tr>
                                <th scope="col">Order Line ID</th>
                                <th scope="col">Order ID</th>
                                <th scope="col">Stock Item ID</th>
                                <th scope="col">Description</th>
                                <th scope="col">Package Type ID</th>
                                <th scope="col">Quantity</th>
                                <th scope="col">Unit Price</th>
                            </tr>
                        </thead>
                        <tbody>
                            {groupedData[orderID].map(({ OrderLineID, StockItemID, Description, PackageTypeID, Quantity, UnitPrice }, index) => (
                                <tr key={`${index}-${OrderLineID}`}>
                                    <td>{OrderLineID}</td>
                                    <td>{orderID}</td>
                                    <td>{StockItemID}</td>
                                    <td>{Description.length > 30 ? Description.substring(0, 30) + '...' : Description}</td>
                                    <td>{PackageTypeID}</td>
                                    <td>{Quantity}</td>
                                    <td>{UnitPrice}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            ))}


        </section >
    )
}

export default OrderLineTable