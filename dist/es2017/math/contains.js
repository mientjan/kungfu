export default function contains(x0, x1, x2, x3) {
    return (x0 <= x2 || x0 <= x3) && (x1 >= x2 || x1 >= x3);
}
