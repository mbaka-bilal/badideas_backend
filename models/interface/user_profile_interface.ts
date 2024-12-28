interface UserProfileInterface {
    email: string,
    uid: string,
    userName: string,
    accessToken: string,
    refreshToken: string,
    createdAt: string,
    deletedAt?: string | null,
    updatedAt?: string | null,
    verified?: string | null
    otp?: string | null,
    password?: string | null
}

export { UserProfileInterface }