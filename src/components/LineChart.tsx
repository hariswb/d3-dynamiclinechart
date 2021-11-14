import { useEffect, useRef, useState } from "react"

import { select, selectAll, Selection } from "d3-selection"
import { scaleLinear, scaleBand } from "d3-scale"
import { max } from "d3-array"
import { line } from "d3-shape"


interface Datum {
    name: string
    num: number
}

const generateData = () => (["a", "b", "c", "d", "e", "f",].map(d => ({ name: d, num: Math.random() * 9 }))
)

const initData: Datum[] = generateData()

const LineChart: React.FC<{}> = (props: any) => {
    const ref = useRef<null | SVGSVGElement>(null)
    const [selection, setSelection] = useState<null |
        Selection<SVGSVGElement | null, unknown, null, undefined>
    >(null)

    const [circlesSelection, setCirclesSelection] = useState<null |
        Selection<SVGGElement, unknown, null, undefined>
    >(null)
    const [linesSelection, setLinesSelection] = useState<null |
        Selection<SVGGElement, unknown, null, undefined>
    >(null)

    const [data, setData] = useState<Datum[]>(initData)

    const maxY = max(data.map(d => d.num))!

    const xScale = scaleBand().domain(data.map(d => d.name)).range([0, 600])
    const yScale = scaleLinear().domain([0, 10]).range([0, 400])

    const linePath = line<Datum>()
        .x((d: Datum) => xScale(d.name)!)
        .y((d: Datum) => yScale(d.num))

    useEffect(() => {
        if (!selection) {
            setSelection(select(ref.current))
        } else if (selection && !circlesSelection) {
            const circlesG = selection.append("g").attr("id", "circles")
            const linesG = selection.append("g").attr("id", "lines")

            setCirclesSelection(circlesG)
            setLinesSelection(linesG)
        }
    }, [selection])

    useEffect(() => {
        if (circlesSelection && linesSelection) {
            drawCircles()
            drawLine()
        }
    }, [data])

    const drawCircles = () => circlesSelection!
        .selectAll("circle")
        .data(data)
        .join(enter => enter
            .append("circle")
            .attr('r', 5)
            .attr('cx', d => xScale(d.name)!)
            .attr('cy', d => yScale(d.num)),
            update => update.attr('cy', d => yScale(d.num))
        )

    const drawLine = () => {
        const lineGraph = linesSelection!
            .selectAll("path")
            .data([data])

        const l = lineGraph
            .join(
                enter => enter.append("path"),
                update => update,
            )

        l.merge(l)
            .attr("d", linePath)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("stroke-linejoin", "round")
            .attr("stroke-linecap", "round")


    }


    const handleDatachange: React.MouseEventHandler = (event) => {
        event.preventDefault()
        setData(generateData())
    }

    return (<div>
        <select>
            <option>League</option>
            <option>2</option>
        </select>
        <button onClick={handleDatachange}>update</button>
        <svg
            ref={ref}
            width={600}
            height={400}
        />
    </div>)
}

export default LineChart