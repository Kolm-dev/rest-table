import React, { useEffect, useState, useCallback } from "react"
import moment from "moment"
import ky from "ky"
import styles from "@/styles/Table.module.css"

interface IData {
	name: string
	id: number
	email: string
	birthday_date: string
	phone_number: string
	address: string
}

interface IResponse {
	count: number
	next: string
	previous: null | string
	results: IData[]
}

export default function Table() {
	const [alert, setAlert] = useState<string>("")

	const [data, setData] = useState<IData[]>([])
	const [edit, setEdit] = useState<number | null>(null)
	const [editData, setEditData] = useState<IData>({
		name: "",
		id: 0,
		email: "",
		birthday_date: "",
		phone_number: "",
		address: "",
	})
	const [nextPage, setNextPage] = useState<string | null>(null)
	const [currentPage, setCurrentPage] = useState<number>(1)
	const itemsPerPage = 10
	const [previousPage, setPreviousPage] = useState<string | null>(null)

	useEffect(() => {
		loadData()
	}, [])

	const loadData = async (page: number = 1) => {
		const offset = (page - 1) * itemsPerPage
		try {
			const response: IResponse = await ky
				.get(`https://technical-task-api.icapgroupgmbh.com/api/table/?limit=${itemsPerPage}&offset=${offset}`)
				.json()
			setData(response.results)
			setNextPage(response.next)
			setPreviousPage(response.previous)
		} catch (error) {
			setAlert(`Error fetching data: ${error}`)
		}
	}

	const onSave = async (id: number) => {
		try {
			let formattedDate = moment(editData.birthday_date, "DD-MM-YY").format("YYYY-MM-DD")
			const fixData = {
				...editData,
				id,
				birthday_date: formattedDate,
			}
			await ky.put(`https://technical-task-api.icapgroupgmbh.com/api/table/${id}/`, {
				json: fixData,
			})
			setEdit(null)
			setAlert(`The data has been updated! Data updated`)
			loadData()
		} catch (error) {
			setAlert(`Error updating data: ${error}`)
		}
	}

	const startEdit = (index: number) => {
		setEditData(data[index])
		setEdit(index)
		setAlert(`Index edit: ${index}`)
	}

	return (
		<div className={`${styles.container}`}>
			{alert ? <h3 className={`${styles.alert}`}>{alert}</h3> : null}
			<table className={styles.table}>
				<thead>
					<tr className={styles.tr}>
						<th className={styles.th}>ID</th>
						<th className={styles.th}>Name</th>
						<th className={styles.th}>Email</th>
						<th className={styles.th}>Birthday</th>
						<th className={styles.th}>Phone Number</th>
						<th className={styles.th}>Address</th>
						<th className={styles.th}>Actions</th>
					</tr>
				</thead>
				<tbody>
					{data.map((person, index) => (
						<tr
							className={styles.tr}
							key={person.id}
						>
							<td className={styles.td}>{person.id}</td>
							<td
								className={styles.td}
								onClick={() => startEdit(index)}
							>
								{edit === index ? (
									<input
										value={editData.name}
										onChange={e => setEditData({ ...editData, name: e.target.value })}
									/>
								) : (
									person.name
								)}
							</td>
							<td
								className={styles.td}
								onClick={() => startEdit(index)}
							>
								{edit === index ? (
									<input
										value={editData.email}
										onChange={e => setEditData({ ...editData, email: e.target.value })}
									/>
								) : (
									person.email
								)}
							</td>
							<td
								className={styles.td}
								onClick={() => startEdit(index)}
							>
								{edit === index ? (
									<input
										value={editData.birthday_date}
										onChange={e => setEditData({ ...editData, birthday_date: e.target.value })}
									/>
								) : (
									person.birthday_date
								)}
							</td>
							<td
								className={styles.td}
								onClick={() => startEdit(index)}
							>
								{edit === index ? (
									<input
										value={editData.phone_number}
										onChange={e => setEditData({ ...editData, phone_number: e.target.value })}
									/>
								) : (
									person.phone_number
								)}
							</td>
							<td
								className={styles.td}
								onClick={() => startEdit(index)}
							>
								{edit === index ? (
									<input
										value={editData.address}
										onChange={e => setEditData({ ...editData, address: e.target.value })}
									/>
								) : (
									person.address
								)}
							</td>
							<td
								className={styles.td}
								onClick={() => startEdit(index)}
							>
								{edit === index ? (
									<>
										<button
											style={{ color: "green", fontWeight: 600, width: "100%" }}
											onClick={() => onSave(person.id)}
										>
											Save
										</button>
										<button
											style={{ color: "red", fontWeight: 600, width: "100%" }}
											onClick={e => {
												e.stopPropagation()
												setEdit(null)
												setAlert("")
											}}
										>
											Cancel
										</button>
									</>
								) : (
									<>
										<button
											style={{ fontWeight: 600, width: "100%" }}
											onClick={() => startEdit(index)}
										>
											Edit
										</button>
									</>
								)}
							</td>
						</tr>
					))}
				</tbody>
			</table>
			<div className={styles.pagination}>
				<button
					onClick={() => {
						setCurrentPage(currentPage - 1)
						loadData(currentPage - 1)
					}}
					disabled={!previousPage}
				>
					Previous page
				</button>

				<button
					onClick={() => {
						setCurrentPage(currentPage + 1)
						loadData(currentPage + 1)
						setAlert(`Page: ${currentPage + 1}`)
					}}
					disabled={!nextPage}
				>
					Next page
				</button>
			</div>
		</div>
	)
}
