import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'

function SmokeTestComponent() {
    return <div data-testid="smoke-test">Invitation Link Ready</div>
}

describe('System Smoke Test', () => {
    it('verifies test infrastructure is working', () => {
        render(<SmokeTestComponent />)
        expect(screen.getByTestId('smoke-test')).toBeInTheDocument()
        expect(screen.getByText('Invitation Link Ready')).toBeInTheDocument()
    })
})
