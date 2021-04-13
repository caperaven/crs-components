export default async function parse(node) {
    const path = await crs.createThreeObject("Shape");
    const point = await crs.createThreeObject("Vector2");
    const control = await crs.createThreeObject("Vector2");

    let firstPoint = await crs.createThreeObject("Vector2");
    let isFirstPoint = true;
    let doSetFirstPoint = false;

    const d = node.getAttribute('d');
    const commands = d.match( /[a-df-z][^a-df-z]*/ig );

    for (let i = 0, l = commands.length; i < l; i ++) {
        const command = commands[ i ];
        const type = command.charAt(0);
        const data = command.substr(1).trim();

        if (isFirstPoint === true) {
            doSetFirstPoint = true;
            isFirstPoint = false;
        }

        let numbers;

        switch ( type ) {
            case 'M':
                numbers = parseFloats( data );
                for (let j = 0, jl = numbers.length; j < jl; j += 2) {
                    point.x = numbers[j + 0];
                    point.y = numbers[j + 1];
                    control.x = point.x;
                    control.y = point.y;

                    if ( j === 0 ) {
                        path.moveTo(point.x, point.y);
                    }
                    else {
                        path.lineTo(point.x, point.y);
                    }

                    if (j === 0 && doSetFirstPoint === true) firstPoint.copy(point);
                }

                break;
            case 'H':
                numbers = parseFloats( data );
                for (let j = 0, jl = numbers.length; j < jl; j ++) {
                    point.x = numbers[j];
                    control.x = point.x;
                    control.y = point.y;
                    path.lineTo( point.x, point.y );

                    if (j === 0 && doSetFirstPoint === true) firstPoint.copy(point);
                }

                break;
            case 'V':
                numbers = parseFloats( data );
                for (let j = 0, jl = numbers.length; j < jl; j ++ ) {
                    point.y = numbers[j];
                    control.x = point.x;
                    control.y = point.y;
                    path.lineTo( point.x, point.y );

                    if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );
                }

                break;
            case 'L':
                numbers = parseFloats( data );
                for (let j = 0, jl = numbers.length; j < jl; j += 2 ) {
                    point.x = numbers[ j + 0 ];
                    point.y = numbers[ j + 1 ];
                    control.x = point.x;
                    control.y = point.y;
                    path.lineTo( point.x, point.y );

                    if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );
                }

                break;
            case 'C':
                numbers = parseFloats( data );
                for (let j = 0, jl = numbers.length; j < jl; j += 6 ) {
                    path.bezierCurveTo(
                        numbers[ j + 0 ],
                        numbers[ j + 1 ],
                        numbers[ j + 2 ],
                        numbers[ j + 3 ],
                        numbers[ j + 4 ],
                        numbers[ j + 5 ]
                    );
                    control.x = numbers[ j + 2 ];
                    control.y = numbers[ j + 3 ];
                    point.x = numbers[ j + 4 ];
                    point.y = numbers[ j + 5 ];

                    if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );
                }

                break;
            case 'S':
                numbers = parseFloats( data );
                for (let j = 0, jl = numbers.length; j < jl; j += 4 ) {
                    path.bezierCurveTo(
                        getReflection( point.x, control.x ),
                        getReflection( point.y, control.y ),
                        numbers[ j + 0 ],
                        numbers[ j + 1 ],
                        numbers[ j + 2 ],
                        numbers[ j + 3 ]
                    );
                    control.x = numbers[ j + 0 ];
                    control.y = numbers[ j + 1 ];
                    point.x = numbers[ j + 2 ];
                    point.y = numbers[ j + 3 ];

                    if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );
                }

                break;
            case 'Q':
                numbers = parseFloats( data );
                for (let j = 0, jl = numbers.length; j < jl; j += 4 ) {

                    path.quadraticCurveTo(
                        numbers[ j + 0 ],
                        numbers[ j + 1 ],
                        numbers[ j + 2 ],
                        numbers[ j + 3 ]
                    );
                    control.x = numbers[ j + 0 ];
                    control.y = numbers[ j + 1 ];
                    point.x = numbers[ j + 2 ];
                    point.y = numbers[ j + 3 ];

                    if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );
                }

                break;
            case 'T':
                numbers = parseFloats( data );
                for (let j = 0, jl = numbers.length; j < jl; j += 2 ) {

                    const rx = getReflection( point.x, control.x );
                    const ry = getReflection( point.y, control.y );
                    path.quadraticCurveTo(
                        rx,
                        ry,
                        numbers[ j + 0 ],
                        numbers[ j + 1 ]
                    );
                    control.x = rx;
                    control.y = ry;
                    point.x = numbers[ j + 0 ];
                    point.y = numbers[ j + 1 ];

                    if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );

                }

                break;
            case 'A':
                numbers = parseFloats( data );
                for (let j = 0, jl = numbers.length; j < jl; j += 7 ) {

                    // skip command if start point == end point
                    if ( numbers[ j + 5 ] == point.x && numbers[ j + 6 ] == point.y ) continue;

                    const start = point.clone();
                    point.x = numbers[ j + 5 ];
                    point.y = numbers[ j + 6 ];
                    control.x = point.x;
                    control.y = point.y;
                    parseArcCommand(
                        path, numbers[ j ], numbers[ j + 1 ], numbers[ j + 2 ], numbers[ j + 3 ], numbers[ j + 4 ], start, point
                    );

                    if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );
                }

                break;
            case 'm':
                numbers = parseFloats( data );
                for (let j = 0, jl = numbers.length; j < jl; j += 2 ) {
                    point.x += numbers[ j + 0 ];
                    point.y += numbers[ j + 1 ];
                    control.x = point.x;
                    control.y = point.y;

                    if ( j === 0 ) {

                        path.moveTo( point.x, point.y );

                    } else {

                        path.lineTo( point.x, point.y );

                    }

                    if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );
                }

                break;
            case 'h':
                numbers = parseFloats( data );
                for (let j = 0, jl = numbers.length; j < jl; j ++ ) {

                    point.x += numbers[ j ];
                    control.x = point.x;
                    control.y = point.y;
                    path.lineTo( point.x, point.y );

                    if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );
                }

                break;
            case 'v':
                numbers = parseFloats( data );
                for (let j = 0, jl = numbers.length; j < jl; j ++ ) {

                    point.y += numbers[ j ];
                    control.x = point.x;
                    control.y = point.y;
                    path.lineTo( point.x, point.y );

                    if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );
                }

                break;
            case 'l':
                numbers = parseFloats( data );
                for (let j = 0, jl = numbers.length; j < jl; j += 2 ) {
                    point.x += numbers[ j + 0 ];
                    point.y += numbers[ j + 1 ];
                    control.x = point.x;
                    control.y = point.y;
                    path.lineTo( point.x, point.y );

                    if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );
                }

                break;
            case 'c':
                numbers = parseFloats( data );
                for (let j = 0, jl = numbers.length; j < jl; j += 6 ) {

                    path.bezierCurveTo(
                        point.x + numbers[ j + 0 ],
                        point.y + numbers[ j + 1 ],
                        point.x + numbers[ j + 2 ],
                        point.y + numbers[ j + 3 ],
                        point.x + numbers[ j + 4 ],
                        point.y + numbers[ j + 5 ]
                    );
                    control.x = point.x + numbers[ j + 2 ];
                    control.y = point.y + numbers[ j + 3 ];
                    point.x += numbers[ j + 4 ];
                    point.y += numbers[ j + 5 ];

                    if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );
                }

                break;
            case 's':
                numbers = parseFloats( data );
                for (let j = 0, jl = numbers.length; j < jl; j += 4 ) {
                    path.bezierCurveTo(
                        getReflection( point.x, control.x ),
                        getReflection( point.y, control.y ),
                        point.x + numbers[ j + 0 ],
                        point.y + numbers[ j + 1 ],
                        point.x + numbers[ j + 2 ],
                        point.y + numbers[ j + 3 ]
                    );
                    control.x = point.x + numbers[ j + 0 ];
                    control.y = point.y + numbers[ j + 1 ];
                    point.x += numbers[ j + 2 ];
                    point.y += numbers[ j + 3 ];

                    if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );

                }

                break;
            case 'q':
                numbers = parseFloats( data );
                for (let j = 0, jl = numbers.length; j < jl; j += 4 ) {
                    path.quadraticCurveTo(
                        point.x + numbers[ j + 0 ],
                        point.y + numbers[ j + 1 ],
                        point.x + numbers[ j + 2 ],
                        point.y + numbers[ j + 3 ]
                    );
                    control.x = point.x + numbers[ j + 0 ];
                    control.y = point.y + numbers[ j + 1 ];
                    point.x += numbers[ j + 2 ];
                    point.y += numbers[ j + 3 ];

                    if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );

                }

                break;
            case 't':
                numbers = parseFloats( data );
                for (let j = 0, jl = numbers.length; j < jl; j += 2 ) {
                    const rx = getReflection( point.x, control.x );
                    const ry = getReflection( point.y, control.y );
                    path.quadraticCurveTo(
                        rx,
                        ry,
                        point.x + numbers[ j + 0 ],
                        point.y + numbers[ j + 1 ]
                    );
                    control.x = rx;
                    control.y = ry;
                    point.x = point.x + numbers[ j + 0 ];
                    point.y = point.y + numbers[ j + 1 ];

                    if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );
                }

                break;
            case 'a':
                numbers = parseFloats( data );
                for (let j = 0, jl = numbers.length; j < jl; j += 7 ) {
                    // skip command if no displacement
                    if ( numbers[ j + 5 ] == 0 && numbers[ j + 6 ] == 0 ) continue;

                    const start = point.clone();
                    point.x += numbers[ j + 5 ];
                    point.y += numbers[ j + 6 ];
                    control.x = point.x;
                    control.y = point.y;
                    parseArcCommand(
                        path, numbers[ j ], numbers[ j + 1 ], numbers[ j + 2 ], numbers[ j + 3 ], numbers[ j + 4 ], start, point
                    );
                    if ( j === 0 && doSetFirstPoint === true ) firstPoint.copy( point );
                }
                break;
            case 'Z':
            case 'z':
                path.autoClose = true;
                if ( path.curves.length > 0 ) {
                    // Reset point to beginning of Path
                    point.copy( firstPoint );
                    path.currentPoint.copy( point );
                    isFirstPoint = true;
                }

                break;
            default:
                console.warn( command );
        }

        // console.log( type, parseFloats( data ), parseFloats( data ).length  )
        doSetFirstPoint = false;
    }
    return path;
}

function parseFloats( string ) {
    const array = string.split(/[\s,]+|(?=\s?[+\-])/);

    for (let i = 0; i < array.length; i++) {
        const number = array[i];

        if (number.indexOf('.') !== number.lastIndexOf('.')) {
            const split = number.split('.');
            for (let s = 2; s < split.length; s ++) {
                array.splice(i + s - 1, 0, '0.' + split[ s ]);
            }
        }
        array[ i ] = Number(number);
    }

    return array;
}

function getReflection(a, b) {
    return a - ( b - a );
}