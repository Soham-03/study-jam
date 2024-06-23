export default interface Workspace {
    id: string|null;
    name: string;
    userId: string;
    urlToSyllabus: string;
    urlToSupportingNotes: string;
    aiResponseSyllabusBreakdown: string;
    aiResponseChapterWiseNotes: string;
    created: string;
    updated: string;
}