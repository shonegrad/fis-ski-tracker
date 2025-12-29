import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { getCountryCode } from '../../services/dataService';

interface NationCupChartProps {
    data: Array<{ country: string; points: number }>;
}

export function NationCupChart({ data }: NationCupChartProps) {
    const svgRef = useRef<SVGSVGElement>(null);
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    // Resize observer
    useEffect(() => {
        if (!containerRef.current) return;

        const resizeObserver = new ResizeObserver(entries => {
            if (!entries || entries.length === 0) return;
            const { width } = entries[0].contentRect;
            setDimensions({ width, height: 300 });
        });

        resizeObserver.observe(containerRef.current);
        return () => resizeObserver.disconnect();
    }, []);

    // D3 Rendering
    useEffect(() => {
        if (!svgRef.current || !data.length || dimensions.width === 0) return;

        const svg = d3.select(svgRef.current);
        svg.selectAll('*').remove(); // Clear previous

        const margin = { top: 20, right: 30, bottom: 40, left: 120 };
        const width = dimensions.width - margin.left - margin.right;
        const height = dimensions.height - margin.top - margin.bottom;

        const g = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);

        // Scales
        const x = d3.scaleLinear()
            .domain([0, d3.max(data, d => d.points) || 0])
            .range([0, width]);

        const y = d3.scaleBand()
            .domain(data.map(d => d.country))
            .range([0, height])
            .padding(0.2);

        // Bars
        g.selectAll('.bar')
            .data(data)
            .enter()
            .append('rect')
            .attr('class', 'bar')
            .attr('y', d => y(d.country) || 0)
            .attr('height', y.bandwidth())
            .attr('x', 0)
            .attr('width', d => x(d.points))
            .attr('fill', 'url(#barGradient)')
            .attr('rx', 4);

        // Gradient
        const gradient = svg.append('defs')
            .append('linearGradient')
            .attr('id', 'barGradient')
            .attr('x1', '0%')
            .attr('y1', '0%')
            .attr('x2', '100%')
            .attr('y2', '0%');

        gradient.append('stop').attr('offset', '0%').attr('stop-color', '#3b82f6').attr('stop-opacity', 0.8);
        gradient.append('stop').attr('offset', '100%').attr('stop-color', '#1d4ed8');

        // Axes
        g.append('g')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(x).ticks(5).tickSizeOpacity(0))
            .select('.domain').remove();

        g.append('g')
            .call(d3.axisLeft(y).tickSize(0))
            .select('.domain').remove();

        // Add flags next to country names
        g.selectAll('.tick text')
            .attr('x', -30)
            .attr('font-weight', '500')
            .attr('fill', 'currentColor');

        // Labels
        g.selectAll('.label')
            .data(data)
            .enter()
            .append('text')
            .attr('x', d => x(d.points) + 5)
            .attr('y', d => (y(d.country) || 0) + y.bandwidth() / 2)
            .attr('dy', '0.35em')
            .text(d => d.points)
            .attr('fill', 'currentColor')
            .attr('font-size', '12px');

    }, [data, dimensions]);

    return (
        <Card className="rounded-2xl bg-surface-container-low elevation-1 border-0">
            <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                    Nations Cup Standings
                    <span className="text-xs font-normal text-muted-foreground ml-auto bg-muted px-2 py-1 rounded">
                        Aggregated Points
                    </span>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div ref={containerRef} className="w-full h-[300px]">
                    <svg ref={svgRef} width="100%" height="100%" className="overflow-visible" />
                </div>
            </CardContent>
        </Card>
    );
}
