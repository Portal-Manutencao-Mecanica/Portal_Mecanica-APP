/**
 * Extrai as iniciais do primeiro e último nome.
 * Exemplo: "Alexandre Santos" -> "AS"
 */
export function getInitials(name: string): string {
    if (!name) return "??";
    
    const words = name.trim().split(/\s+/);
    
    if (words.length === 1) {
        return words[0].substring(0, 2).toUpperCase();
    }
    
    const firstLetter = words[0][0];
    const lastLetter = words[words.length - 1][0];
    
    return `${firstLetter}${lastLetter}`.toUpperCase();
}