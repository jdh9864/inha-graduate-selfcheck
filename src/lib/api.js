import { http } from "./http";

// ---- 공통 유틸 ----
const get  = async (url, params) => (await http.get(url, { params })).data;
const post = async (url, body, cfg) => (await http.post(url, body, cfg)).data;
const put  = async (url, body, cfg) => (await http.put(url, body, cfg)).data;
const del  = async (url, params) => (await http.delete(url, { params })).data;

// ---- Endpoints ----
export const AdminAPI = {
    // POST /admin/login
    login: (payload) => post("/admin/login", payload),
};

export const TranscriptAPI = {
    // POST /transcript (multipart/form-data)
    upload: (file) => {
        const form = new FormData();
        form.append("multipartFile", file);
        return post("/transcript", form, {
            headers: { "Content-Type": "multipart/form-data" },
        });
    },
};

export const GraduationCheckAPI = {
    // POST /graduation-check
    check: (payload) => post("/graduation-check", payload),
};

export const GraduationRequirementAPI = {
    create: (payload) => post("/graduation-requirement", payload),
    update: (id, year, payload) =>
        put(`/graduation-requirement/${id}`, payload, { params: { year } }),
    remove: (id, year) => del(`/graduation-requirement/${id}`, { year }),
    addCourse: (grId, payload) => post(`/graduation-requirement/${grId}/courses`, payload),
    addCoreSubject: (grId, year, urlCoreType) =>
        post(`/graduation-requirement/${grId}/core-subject`, undefined, { params: { year, urlCoreType } }),
    deleteCoreSubject: (grId, urlCoreType) =>
        del(`/graduation-requirement/${grId}/core-subject`, { urlCoreType }),
};

export const GraduationRequirementQueryAPI = {
    listByYear: (year) => get("/graduation-requirements", { year }),
    findCourses: (department, year, courseType) =>
        get("/graduation-requirements/courses", { department, year, courseType }),
    findById: (id) => get(`/graduation-requirement/id/${id}`),
    findByDepartment: (department, year) =>
        get(`/graduation-requirement/department/${encodeURIComponent(department)}`, { year }),
};

export const EnglishAPI = {
    listTypes: () => get("/english-types"),
};

export const DepartmentAPI = {
    list: () => get("/departments"),
};

export const CourseAPI = {
    create: (payload) => post("/course", payload),
    remove: (id) => del(`/course/${id}`),
    listAll: () => get("/courses"),
    findByTitle: (title) => get("/course/title", { title }),
    findById: (id) => get(`/course/id/${id}`),
    findByCredits: (credits) => get("/course/credits", { credits }),
    findByCourseNumber: (courseNumber) =>
        get(`/course/courseNumber/${encodeURIComponent(courseNumber)}`),
};
