import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { getBaseUrl } from "../../../utils/baseURL";

const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${getBaseUrl()}/api/auth`,
        credentials: 'include',
    }),
    endpoints: (builder) => ({
        registerUser: builder.mutation({
            query: (newUser) => ({
                url: "/register",
                method: "POST",
                body: newUser
            })
        }),
        loginUser: builder.mutation({
            query: (credentials) => ({
                url: "/login",
                method: "POST",
                body: credentials
            })
        }),
        logoutUser: builder.mutation({
            query: (credentials) => ({
                url: "/logout",
                method: "POST",
                body: credentials
            })
        }),
        getUser: builder.query({
            query: () => ({
                url: "/users",
                method: "GET",
            }),
            refetchOnMount: true,
            invalidatesTags: ["User"],
        }),
        deleteUser: builder.mutation({
            query: (userId) => ({
                url: `/users/${userId}`,
                method: "DELETE",
            }),
            invalidatesTags: ["User"],
        }),
        updateUserRole: builder.mutation({
            query: ({ userId, role }) => ({
                url: `/users/${userId}`,
                method: "PUT",
                body: { role }
            }),
            refetchOnMount: true,
            invalidatesTags: ["User"],
        }),
        editProfile: builder.mutation({
            query: (profileData) => ({
                url: `/edit-profile`,
                method: "PATCH",
                body: profileData
            }),
        }),
        getPendingWholesalers: builder.query({
            query: () => ({
                url: "/users/pending-wholesalers",
                method: "GET"
            }),
            providesTags: ["Wholesalers"],
        }),
        approveWholesaler: builder.mutation({
            query: ({ userId, status }) => ({
                url: `/users/approve-wholesaler/${userId}`,
                method: 'PATCH',
                body: { status },
            }),
            invalidatesTags: ['Wholesalers'],
        }),
        resendVerification: builder.mutation({
            query: (data) => ({
                url: "/resend-verification",
                method: "POST",
                body: data
            })
        }),
        verifyEmail: builder.mutation({
            query: (data) => ({
                url: "/verify-email",
                method: "GET",
                params: data
            })
        }),
    }),
});

export const {
    useRegisterUserMutation,
    useLoginUserMutation,
    useLogoutUserMutation,
    useGetUserQuery,
    useDeleteUserMutation,
    useUpdateUserRoleMutation,
    useEditProfileMutation,
    useGetPendingWholesalersQuery,
    useApproveWholesalerMutation,
    useResendVerificationMutation,
    useVerifyEmailMutation
} = authApi;

export default authApi;