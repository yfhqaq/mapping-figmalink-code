import React, { FC, HTMLAttributes } from 'react';

export const BrandLogo: FC<HTMLAttributes<HTMLDivElement>> = ({ color, ...props }) => (
    <div {...props}>
        <svg
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            height="100%"
            viewBox="0 0 632 840.8"
            xmlSpace="preserve"
            version="1.1"
        >
            <g fill={color ?? 'var(--color-primary)'}>
                <path
                    d="M309.3,1.9L98.1,60.7v13.7c0,15-44.7,41.8-84.8,56.4L0,135.8v321.1c0,106.6,53.2,206.3,154,288.2
					c75.3,61.3,149.9,90.9,153,92.2l9,3.5l9-3.5c3.1-1.2,77.7-30.9,153-92.2c100.7-82,154-181.7,154-288.2V135.8l-13.3-4.9
					c-40.1-14.7-84.7-41.5-84.7-56.4V60.7L316,0L309.3,1.9z M316,39.7l177.4,49.4c13,33.8,67.2,59.9,95,71.4v296.4
					c0,96.9-46.8,184.4-139.2,259.9C393.5,762.2,337.3,789.5,316,799c-21.3-9.5-77.5-36.8-133.1-82.2
					c-92.4-75.5-139.2-163-139.2-259.9V160.5c27.8-11.5,82-37.7,95-71.4L316,39.7z"
                />
            </g>
        </svg>
    </div>
);
