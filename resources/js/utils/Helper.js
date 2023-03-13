import React, { useState, useEffect, useLayoutEffect } from "react";

export const useWindowSize = () => {
    const [size, setSize] = useState([0, 0]);
    useLayoutEffect(() => {
        function updateSize() {
            setSize([window.innerWidth, window.innerHeight]);
        }
        window.addEventListener("resize", updateSize);
        updateSize();
        return () => window.removeEventListener("resize", updateSize);
    }, []);
    return size;
};

export const useMousePos = () => {
    const [mousePos, setMousePos] = useState({});
    useEffect(() => {
        const getMousePos = (e) => {
            const posX = e.clientX;
            const posY = e.clientY;
            setMousePos({ posX, posY });
        };
        document.addEventListener("mousemove", getMousePos);
        return function cleanup() {
            document.removeEventListener("mousemove", getMousePos);
        };
    });
    return mousePos;
};

export const searchInObject = (array, searchVal) => {
    var results = [];
    array.map((element) => {
        const keys = Object.keys(element);
        const index = keys.findIndex((key) => {
            if (
                typeof element[key] !== "object" &&
                key !== "id" &&
                `${element[key]}`.search(searchVal) !== -1
            ) {
                return true;
            } else if (typeof element[key] === "object") {
                const idx = element[key].findIndex((elmnt) => {
                    const subkeys = Object.keys(elmnt);
                    const subidx = subkeys.findIndex(
                        (subkey) =>
                            typeof elmnt[subkey] !== "object" &&
                            subkey !== "id" &&
                            `${elmnt[subkey]}`.search(searchVal) !== -1
                    );
                    return subidx >= 0;
                });
                return idx >= 0;
            }
            return false;
        });
        if (index >= 0) {
            results.push(element);
        }
    });
    /*
    for (var i = 0; i < array.length; i++) {
        for (const [key, value] of Object.entries(array[i])) {
            // if (value.indexOf(searchVal) != -1) {
            //     results.push(array[i]);
            // }

            if(typeof(value) !== 'object' && key !== 'id') {
                if(`${value}`.search(searchVal) !== -1) {
                    results.push(array[i])
                    break
                }
            } else if(typeof(value) === 'object') {
                for (const [subkey, subvalue] of Object.entries(value)) {
                    if(key !== 'id') {
                        if (`${subvalue}`.search(searchVal) !== -1) {
                            results.push(array[i])
                            break
                        }   
                    }
                }
            }
            // console.log(`${key}: ${typeof (value)}`);
        }
    }
    */

    return results;
};

export const useInterval = (callback, delay) => {
    const intervalRef = React.useRef();
    const callbackRef = React.useRef(callback);

    // Remember the latest callback:
    //
    // Without this, if you change the callback, when setInterval ticks again, it
    // will still call your old callback.
    //
    // If you add `callback` to useEffect's deps, it will work fine but the
    // interval will be reset.

    React.useEffect(() => {
        callbackRef.current = callback;
    }, [callback]);

    // Set up the interval:

    React.useEffect(() => {
        if (typeof delay === "number") {
            intervalRef.current = window.setInterval(
                () => callbackRef.current(),
                delay
            );

            // Clear interval if the components is unmounted or the delay changes:
            return () => window.clearInterval(intervalRef.current);
        }
    }, [delay]);

    // Returns a ref to the interval ID in case you want to clear it manually:
    return intervalRef;
};

export const getImg = (img) => {
    return require(`../assets/${img}`).default;
};

export const checkMobileDevice = () => {
    const toMatch = [
        /Android/i,
        /webOS/i,
        /iPhone/i,
        /iPad/i,
        /iPod/i,
        /BlackBerry/i,
        /Windows Phone/i,
    ];
    return toMatch.some((toMatchItem) => {
        return navigator.userAgent.match(toMatchItem);
    });
};

export const useResize = () => {
    const [screenSize, setScreenSize] = useState({
        width: 0,
        height: 0,
        isMobile: false,
        isResponsive: false,
    });

    const updateSize = () => {
        setScreenSize({
            width: window.innerWidth,
            height: window.innerHeight,
            isMobile: window.innerWidth < 992,
            isResponsive: window.innerWidth < 1320,
        });
    };

    useEffect(() => {
        window.addEventListener("resize", updateSize);
        updateSize();

        return () => {
            window.removeEventListener("resize", updateSize);
        };
    }, []);

    return screenSize;
};

function getWindowDimensions() {
    const { innerWidth: width, innerHeight: height } = window;
    return {
        width,
        height,
    };
}

export const useWindowDimensions = () => {
    const [windowDimensions, setWindowDimensions] = useState(
        getWindowDimensions()
    );

    useEffect(() => {
        function handleResize() {
            setWindowDimensions(getWindowDimensions());
        }

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return windowDimensions;
};

// export const useDetectOutsideClick = (el, initialState) => {
//     const [isActive, setIsActive] = useState(initialState);

//     useEffect(() => {
//         const onClick = e => {
//             if (el.current !== null && !el.current.contains(e.target)) {
//                 setIsActive(!isActive);
//             }
//         };

//         if (isActive) {
//             window.addEventListener("click", onClick);
//         }

//         return () => {
//             window.removeEventListener("click", onClick);
//         };
//     }, [isActive, el]);

//     return [isActive, setIsActive];
// };
